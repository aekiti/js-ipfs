'use strict'

const os = require('os')
const fs = require('fs-blob-store')
const IPFSRepo = require('ipfs-repo')
const path = require('path')

module.exports = (dir) => {
  const repoPath = dir || process.env.IPFS_PATH || path.join(os.homedir(), '.ipfs')
  return new IPFSRepo(repoPath, {stores: fs})
}

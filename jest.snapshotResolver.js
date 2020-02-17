module.exports = {
  testPathForConsistencyCheck: 'some/example.test.js',

  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace(/\.test\.([tj]sx?)/, `${snapshotExtension}.$1`),

  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath.replace(snapshotExtension, '.test'),
}

'use strict ';

/* Test framework */
var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);
var assert = chai.assert;
var expect = chai.expect;
var file = chaiFiles.file;
var dir = chaiFiles.dir;

/* storage library to test */
var storage = require('../');
var projectID = "cyrus-playground";
var bucketID =  "cyrus-storage-test";

process.env.GOOGLE_APPLICATION_CREDENTIALS = "test/cyrus-playground-3d3c570d03ee.json";

describe ("google cloud storage", function() {

  var gcs;

  before(function() {
    gcs = storage.init('gcs', {
      project: projectID,
      bucket: bucketID
    });
  });

  describe("testing storage with gcs bucket `cyrus-storage-test`", function() {
    this.timeout(0);
    let fdir = "testdir1";
    let fname = "test1.json";
    let content = JSON.stringify({a:1,b:2});
    let path = "";
    it("Should save a text file containing json:" + content, function(done) {
      gcs.store(content, bucketID, fdir, fname, function(p) {
        path = p;
        gcs.retrieve(path, function(data) {
          expect(data).to.contain(content);
          done();
        });
      });
    });

    it("Should delete a data file", function(done) {
console.log(path);
      gcs.delete(path, function() {
        gcs.retrieve(path, function(data) {
          expect(data).not.to.contain(content);
          done();
        });
      });
    });

  });
});
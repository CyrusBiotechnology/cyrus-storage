var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);

var assert = chai.assert;
var expect = chai.expect;
var file = chaiFiles.file;
var dir = chaiFiles.dir;

var storage = require('../');

var fs = require('fs');
var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};


describe('Local storage', function() {

    var local;
    before(function() {
        local = storage.init('local', {
            bucketDir: 'mocha_test1'
        });

        localZiped = storage.init('local', {
            bucketDir: 'mocha_test_compressed',
            compression: true
        });
    });

    describe('Testing storage on local filesystem.', function() {
        it('should save data to a file in the default bucket folder and return the path', function(done) {
            local.store('Hello World!', function(path) {
                expect(path).to.match(/^mocha_test1/);
                expect(path).not.to.match(/undefined/);
                expect(file(path)).to.exist;
                expect(file(path)).to.contain('Hello World!');

                local.retrieve(path, function(data) {
                    expect(data).to.contain('Hello World!');
                    done();
                });

            });
        });

        it('should save data to a file in an specific bucket folder and return the path.', function(done) {
            local.store('Hello World!', 'mocha_test2', function(path) {
                expect(path).to.match(/^mocha_test2/);
                expect(path).not.to.match(/undefined/);
                expect(file(path)).to.exist;
                expect(file(path)).to.contain('Hello World!');
                local.retrieve(path, function(data) {
                    expect(data).to.contain('Hello World!');
                    done();
                });
            });
        });

        it('should save data to a file in an specific folder in a bucket folder and return the path.', function(done) {
            local.store('Hello World!', 'mocha_test2', 'folderA', function(path) {
                expect(path).to.match(/^mocha_test2\/folderA/);
                expect(path).not.to.match(/undefined/);
                expect(file(path)).to.exist;
                expect(file(path)).to.contain('Hello World!');
                local.retrieve(path, function(data) {
                    expect(data).to.contain('Hello World!');
                    done();
                });
            });
        });

        it('should save data to a specific file in an folder in a bucket folder and return the path.', function(done) {
            local.store('Hello World!', 'mocha_test2', 'folderA', 'fileX', function(path) {
                expect(path).to.match(/^mocha_test2\/folderA\/fileX/);
                expect(path).not.to.match(/undefined/);
                expect(file(path)).to.exist;
                expect(file(path)).to.contain('Hello World!');
                local.retrieve(path, function(data) {
                    expect(data).to.contain('Hello World!');
                    done();
                });
            });
        });

        it('should save data to a file in an specific bucket folder and return the path.', function(done) {
            local.store('Hello World!', 'mocha_test2', 'folderA/folderB', 'fileX', function(path) {
                expect(path).to.match(/^mocha_test2\/folderA\/folderB\/fileX/);
                expect(path).not.to.match(/undefined/);
                expect(file(path)).to.exist;
                expect(file(path)).to.contain('Hello World!');
                local.retrieve(path, function(data) {
                    expect(data).to.contain('Hello World!');
                    done();
                });
            });
        });

        it('should save data to a compressed file.', function(done) {
            localZiped.store('Hello World!', 'mocha_test2', 'folderA/folderB', function(path) {
                expect(path).to.match(/^mocha_test2\/folderA\/folderB/);
                expect(path).not.to.match(/undefined/);
                expect(file(path)).to.exist;
                expect(file(path)).not.to.contain('Hello World!');
                local.retrieve(path, function(data) {
                    expect(data).to.contain('Hello World!');
                    done();
                });
            });
        });

    });

    after(function() {
        deleteFolderRecursive('mocha_test2');
        deleteFolderRecursive('mocha_test1');
        deleteFolderRecursive('mocha_test_compressed');
    });
});

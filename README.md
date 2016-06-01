### GCS

```javascript
gcs = storage.init('gcs', {project:'cyrusmolcloud'})

gcs.store('Hello World!', 'storage-test-adasdaf3', console.log)
//storage-test-adasdaf3/1ca4ac31-2b91-4934-97bb-82ee2a5e25da.txt

gcs.retrieve('storage-test-adasdaf3/1ca4ac31-2b91-4934-97bb-82ee2a5e25da.txt', console.log)
//Hello World!
```

### Local storage
```javascript
var local = storage.init('local')

local.store('Hello World', console.log)
//./local_storage/8368d330-46d3-4374-a107-485e26902fa2

local.retrieve('./local_storage/8368d330-46d3-4374-a107-485e26902fa2', console.log)
//Hello World
```

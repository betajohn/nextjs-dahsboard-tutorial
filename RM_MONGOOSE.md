# MongoDB & Mongoose tips and tricks

## return values in mongoose

### Model.find({})

Returns a mongoose.Query

```text
The Query object provides methods such as where(), sort(), limit(), skip(), etc., which allow you to specify criteria for selecting documents, sorting them, limiting the number of results, skipping a certain number of documents, and so on. These methods can be chained together to build complex queries.

example
Model.find({}).where(condition)

Once you have constructed your query using methods on the Query object, you typically execute it using methods like exec(), then(), or callback() to actually retrieve the results from the MongoDB database.
```

when promise is completed returns an array of documents(array of objects in js)

## Date

### MongoDB's Date vs Javascript's Date

MongoDB's native date type stores dates as 64-bit integers representing the number of milliseconds since the Unix epoch (January 1, 1970, UTC). On the other hand, JavaScript's Date object also represents dates as milliseconds since the Unix epoch but internally handles date and time values as 64-bit floating-point numbers, allowing for a wider range of values.

When working with MongoDB through Mongoose or directly with the MongoDB Node.js driver, dates are typically converted to JavaScript Date objects in your application code. This means that you can interact with dates in your JavaScript code using the familiar Date object methods and properties.

> The recommended way to store dates in MongoDB is to use the BSON Date data type.

```text
JavaScript's Date object operates in the local time zone by default, while MongoDB's native date type stores dates in UTC.

```

## Nested Schema

```ts
const MainSchema = new Schema({
  title: String,
  description: String,
  nestedItems: [NestedItemSchema], // Nested array of NestedItemSchema
});
```

## Get number of documents

```js
const x:number = await Model.find({}).countDocuments();
```

## Combine 2 queries into a single one using aggregation

```js
InvoiceModel.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
      totalAmount: { $sum: '$amount' },
    },
  },
  {
    $match: {
      _id: { $in: ['paid', 'pending'] },
    },
  },
]);

//--output--
output = [
  {
    totalAmount: 118516,
    _id: 'paid',
    count: 10,
  },
  {
    _id: 'pending',
    count: 5,
    totalAmount: 125632,
  },
];
```

This aggregation pipeline does the following:

1.- $group: Groups documents by the 'status' field and calculates the count and sum of amounts for each group.

2.- $match: Filters the groups to only include those with 'paid' or 'pending' status.

This will return the counts for both 'paid' and 'pending' status in a single query result.

## Common Queries

### Find by multiple criteria using the $or operator

```ts
const invoices = await InvoiceModel.find({
  $or: [{ 'query here' },{ 'query here' }, ],
});
```

### Return any documents where the specified field contains the query, case insensitive.

```js
const userInput = 'angel'
Model.find({ 'customer.name': { $regex: userInput, $options: 'i' })

//--explanation--
 $regex: userInput  //This part specifies the regular expression to match the text string

$options: 'i'// This specifies case-insensitive matching, so it will match "angel", "Angel", "aNgEl", etc.
```

### find() by date

```ts
const startOfDay = new Date(2024,04,19,0,0,0);

const endOfDay = new Date(2024,04,20,0,0,0);// or new Date(2024,04,19,23,59,59) - but milliseconds?

const documents = await YourModel.find({
  createdAt: {
    $gte: startOfDay,
    $lt: endOfDay
  })
```

### sort() the resulting documents after a find()

Sorting by creation date:

```ts
const userInput = 'angel'
const sortOrder = anotherUserInput // Replace sortOrder with 1 for ascending or -1 for descending
const documents = Model.find({ 'customer.name': { $regex: userInput, $options: 'i' })
                       .sort({ createdAt: sortOrder }); // sorting by creation date
```

### limit() the number of documents after a find()

```ts
const userInput = 'angel'
const sortOrder = anotherUserInput // Replace sortOrder with 1 for ascending or -1 for descending
const limit = 10 // pagesize
const documents = Model.find({ 'customer.name': { $regex: userInput, $options: 'i' })
                       .sort({ createdAt: sortOrder }) // sorting by creation date
                       .limit(limit)
```

### skip() a number of documents after a find()

```ts
const userInput = 'angel'
const sortOrder = anotherUserInput // Replace sortOrder with 1 for ascending or -1 for descending
const limit = 10 // pagesize
const pageNuber = 2 // example for second page of results
const documents = Model.find({ 'customer.name': { $regex: userInput, $options: 'i' })
                       .sort({ createdAt: sortOrder }) // sorting by creation date
                       .limit(limit)
                       .skip((pageNumber-1)*limit); // page 1 will skip (1-1)*10 = 0 documents
                                                    // page 2 will skip (2-1)*10= 10 documents
```

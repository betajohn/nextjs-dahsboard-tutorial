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

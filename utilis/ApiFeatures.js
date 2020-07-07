 class ApiFeatures {
   constructor(query, queryString) {
     this.query = query;
     this.queryString = queryString;
   }
   //https:://localhost:3000?name=1
   //?name=Ahmed

   filter() {
      const filterArr = ["sort", "page", "limit", "field"];
      const querySt = {...this.queryString}

           if (querySt) {
       for (var val in querySt) {

       if (filterArr.includes(val)) {
         delete querySt[val];
       }
       }
       //price[&gt=300]
       const queryStringified = JSON.parse(JSON.stringify(querySt).replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`));
       this.query.find(queryStringified);
     }
     return this;
   }

   sort() {
     const sortCriteria = this.queryString.sort;

      if (sortCriteria) {
          this.query.sort(sortCriteria.split(",").join(" "));
      } else {
        this.query.sort("+name");
      }

      return this;
   }
   field() {

     if (this.queryString.field) {
       this.query = this.query.select(this.queryString.field.split(",").join(" "));
      } else {
          this.query =   this.query.select("-_v")
      }
      return this;
   }

   paginate() {
     if (this.queryString.page) {
     const page = this.queryString.page * 1 || 1;
     const limit = this.queryString.limit * 1|| 100;
     const skip = (page - 1) * limit;
     this.query = this.query.skip(skip).limit(limit);

   }
    return this;
   }
 }


 module.exports = ApiFeatures;

 /*
Problems Due To Security

mmkn y3ml dupliacted f field lsort

//ex = &sort=name&sort=ahmed wnt mwk3 bta3k m4 mtkw3 da w ynklk ksmo
 */

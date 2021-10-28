### Change Request Board Ticket
- [CRB-0000](https://securedatacommons.atlassian.net/browse/CRB-0000)

### Summary of Changes
- _Provide a summary of the change to be implemented_

### Code Review Checklist
- [ ] **Avoid Hardcoding**  
Any string literal values that are likely to change should not be hardcoded and instead put into a config file or something like the AWS Systems Manager Parameter Store.   This would obviously include any secrets but would also include things URLs, user names, target services, etc.   For example, if posting to an SNS topic, we might consider externalizing the topic name to make it configurable.
For cases where this seems like overkill, a good compromise is hardcoding a default value.   In other words, attempt to read from an external configuration (e.g. Parameter Store) but use the default value if not found.   This does not require much more code but gives you an option to change configuration later if needed.

- [ ] **Cyclomatic Complexity**  
Avoid writing functions that have too many nested decision points (conditional logic, looping, etc.).   Generally, if a function has more than about 10 decision points (adding a point for each if/else/for/while, etc.) it should be broken up into multiple functions.  

- [ ] **Code Reusability**  
We must avoid copying-and-pasting code in multiple places.   If we have utility functions that would be useful they should be put in a common library for reuse.   For Lambda functions, this may mean creating a Lambda layer for utility code that can be reused across multiple Lambdas.   For regular Python code, this might involve creating a custom Python library.    Even if this is the first time writing a piece of code, if it can be made generic and put into a common library/package, we should strongly consider doing this. 

- [ ] **Self-Documenting Code**  
Code should include comments for clarity when appropriate but should also be self-documenting to the extent possible.   This means using meaningful function and variable names to help indicate when the function or variable is being used for.   Comments above a function that explain the inputs and outputs are useful but not necessary for code that has a good function name and can be understood by a junior developer.

- [ ] **Logging and Debuggability**  
Code should have an appropriate amount of logging to be able to troubleshoot foreseeable problems.   This might include logging the major inputs at function entry and outputs at function exit, as well as at major decision points within this function.   Be wary of having too much logging, especially within loops that may iterate hundreds or thousands of times.   A good compromise is to have normal logging and then provide a debug switch as an environment variable to enable for detailed logging.  The psuedocode would look like: 
  ```python
  total = 0
  print (“Entered logging; input “ + inputVariable)
  
  for (int i = 0; i < deposits.size(); i++)
       if (debugLog == true)
           print(“Added deposit of  => “ + deposits[i]
      total = total + deposit[i]
  
  print (“Exiting with total amount => “ + total)
  ```

- [ ] **Testability**  
When reviewing code, ask the question of how it can be unit tested (ideally using automation).   This means that external dependencies should be minimized and can be stubbed/faked when necessary.   Utilizing interfaces when interacting between layers will help with this.

- [ ] **Thread Safety**  
Is the code being executed in multiple threads concurrently?   If so, are there shared variables/data accessed that require synchronization between the threads?    Are external resources such as files or databases accessed in a way that requires locking?

- [ ] **Input Validation**  
Are inputs to the program provided by a trusted source?   If not, are inputs validated and sanitized before they are used in the program?

- [ ] **Error Handling**  
Exceptions should be logged unless they are an expected, valid use case.    Exceptions should NOT be swallowed unless they are recoverable and/or it is critical to business operations that processing continue (e.g. you are processing a batch of records and 1 fails but the business needs require that we attempt to process the remainder of the batch).
Resources such as open files and database connections should be freed in a finally block so that they are cleaned regardless of successful completion.

- [ ] **Security**  
Are secrets being utilized in the code?   If so, are they handled properly and not logged to output or exposed.  If necessary, is appropriate authentication in place for the code to be invoked?   Is input data from non-trusted sources appropriately validated and/or sanitized?

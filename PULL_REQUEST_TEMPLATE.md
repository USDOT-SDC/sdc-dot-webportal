### Summary of Changes
- _Provide a summary of the change to be implemented_

## DevOps Checklist
- [ ] **Pull Request Title**  
The pull request title should be in accordance with the following naming convention:  
_SDC-{parent} SDC-{child} CRB-{000}: {CRB Title}_  
For example:
  - SDC-5332 SDC-3798 CRB-526: Web Portal: Fix Overwrite Export Request Issue
  - SDC-5435 SDC-4870 CRB-515: Waze: Implement point-in-time recovery for DynamoDB
  - SDC-6548 SDC-6480 CRB-522: Web Portal: Edit Footer to get rid of contract number

- [ ] **Avoid Hardcoding**  
Any string literal values that are likely to change should not be hardcoded and instead put into a config file or something like the AWS Systems Manager Parameter Store.

- [ ] **Self-Documenting Code**  
Code should include comments for clarity, but should also be self-documenting. This means using meaningful function and variable names to help indicate why/when the function or variable is used.

- [ ] **Docstrings and Type Hints**  
In Python scripts:
  - Include docstrings: [Wikipedia: Docstring ∬Python](https://en.wikipedia.org/wiki/Docstring#Python)
    ```python
    def my_function(arg1: Any, arg2: Any) -> Any:
    """This function does something.

    Args:
      arg1: The first argument.
      arg2: The second argument.

    Returns:
      The result of doing something.
    """
    # Do something with arg1 and arg2.
    return result
    ```
  - Use type hints: [Python Support for Type Hints](https://docs.python.org/3/library/typing.html)

- [ ] **Logging and Debugging**  
Code should have an appropriate amount of logging to be able to troubleshoot foreseeable problems.

- [ ] **Error Handling**  
Exceptions should be logged unless they are an expected, valid use case. Exceptions should NOT be swallowed unless they are recoverable.

- [ ] **Security**  
Are secrets being utilized in the code? If so, are they handled properly and not logged to output or exposed. Does this change require a Security Impact Analysis (SIA)?  
Check for the following:
  - Passwords
  - Private Tokens/Keys
  - Account Numbers
  - Usernames
  - Email Addresses

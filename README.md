# AWS Secrets Environment

A Node module to easily load AWS Secrets Manager JSON secrets into your application's environment variables.

* Each key from the loaded secret will be registered as `process.env[key]`
* Existing process.env.xxx variables will **not** be overwritten.
* If the value of said key is 'true' or 'false', it will be converted to a boolean

## Usage

With these secrets stored in AWS Secrets Manager as `MyApplicationDevSecrets`:

```json
{
	"NODE_ENV": "development",
	"DB_USER": "user-from-aws",
	"DB_PASS": "secret-from-aws"
}
```

```javascript
const loadAWSJSONSecretsIntoENV = require('aws-secrets-environment')
const region = 'us-east-1'
const secretName = 'MyApplicationDevSecrets'

// set an env var before loading? it won't get overridden
process.env.DB_PASS = 'secret-from-code'

await loadAWSJSONSecretsIntoENV(region, secretName, console.log)

console.log(process.env.NODE_ENV, process.env.DB_USER, process.env.DB_PASS)
// Output is: "development", "user-from-aws", 'secret-from-code'

// start your application
````

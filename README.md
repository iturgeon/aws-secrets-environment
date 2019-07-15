# AWS Secrets Environment

A Node module to easily load [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) JSON secrets into your application's environment variables. This will allow your application to follow the [Twelve-Factor App](https://12factor.net/) principals while keeping access to your secrets controlled with AWS IAM.

* Each key from the loaded secret will be registered as `process.env[key]`
* Existing process.env variables will **not** be overwritten.
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

index.js

```javascript
const loadAWSJSONSecretsIntoENV = require('aws-secrets-environment')
const region = 'us-east-1'
const secretName = 'MyApplicationDevSecrets'

// set an env var before loading? it won't get overridden
process.env.DB_PASS = 'secret-from-code'

loadAWSJSONSecretsIntoENV(region, secretName, console.log)
.then(() => {
	console.log(process.env.NODE_ENV, process.env.DB_USER, process.env.DB_PASS)
	// Output is: "development", "user-from-aws", 'secret-from-code'
	// start your application
})
````

### Arguments

`loadAWSJSONSecretsIntoENV('us-east-1', 'mySecret', logger.info)`

1. string [AWS Region](https://docs.aws.amazon.com/general/latest/gr/rande.html)
2. string Name of Secret Manager Secret (select "Other type of secrets" when creating)
3. Optional function that will receive log messages

### Return

loadAWSJSONSecretsIntoENV returns a Promise. Once it resolves the secrets are available on process.env.

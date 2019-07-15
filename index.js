const AWS = require('aws-sdk')

const loadSecrets = (region, SecretId) =>
	new Promise((resolve, reject) => {
		const secretsManager = new AWS.SecretsManager({region})

		secretsManager.getSecretValue({SecretId}, (err, data) => {
			const rejectOn = [
				'DecryptionFailureException',
				'InternalServiceErrorException',
				'InvalidParameterException',
				'InvalidRequestException',
				'ResourceNotFoundException'
			]
			if(err && rejectOn.indexOf(err.code)) reject(err)
			resolve(data.SecretString)
		})
	})

const loadAWSJSONSecretsIntoENV = (region, secretId, logFn = () => {}) =>
	loadSecrets(region, secretId)
	.then(secrets => {
		var secrets = JSON.parse(secrets)
		for (const key in secrets){
			if(!process.env[key]){
				let val = secrets[key].trim()
				if(val === 'false') val = false
				if(val === 'true') val = true
				process.env[key] = val
				logFn(`env ${key} loaded from AWS Secrets Manager`)
			}
			else{
				logFn(`env ${key} loaded from AWS but not used because it is already set`)
			}
		}
	})

module.exports = loadAWSJSONSecretsIntoENV

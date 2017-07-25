
const config = require('./config');

class Service {

	constructor(options) {
		this.api = options.api || config.api;
	}

	log(log) {
		fetch(this.api.log, body: {})
	}

	error(error) {
		fetch(this.api.error, body: {})
	}

	performance(performance) {
		fetch(this.api.performance, body: {})
	}

	setApi() {
		
	}
}

export default Service

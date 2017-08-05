
const axios = require('axios');

class Service {

  constructor(options) {
    this.api = options.api || {};
  }

  sendLog(log) {
    return axios.post(this.api.log, log);
  }

  sendError(error) {
    return axios.post(this.api.error, error);
  }

  sendPerformance(performance) {
    return axios.post(this.api.performance, performance);
  }

  setApi(api) {
    this.options.api = api
  }
}

export default Service

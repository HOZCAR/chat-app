module.exports = {
  default: {
    require: ['step-definitions/*.js'],
    format: ['html:reports/cucumber-report.html'],
    publishQuiet: true
  }
};
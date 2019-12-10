const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
/**
* An HTTP endpoint that acts as a webhook for Twilio sms.received event
* @param {object} event
* @returns {object} result The result of your workflow steps
*/
module.exports = async (event) => {
  let [day, exercise, notes, date] = event.Body.split(',')
  if (!exercise || !notes) {
    return;
  }

  // Prepare workflow object to store API responses

  let result = {};

  // [Workflow Step 1]

  console.log(`Running airtable.query[@0.4.2].insert()...`);
  
  console.log(day, exercise, notes)
  if (!notes) {
    return;
  }

  result.step1 = {};
  result.step1.insertQueryResults = await lib.airtable.query['@0.4.2'].update({
    table: `Workout`,
    where: [
      {
        Day: Number(day),
        'Exercise__icontains': exercise.trim()
      }
    ],
    fields: {
        'Notes': notes,
    },
    typecast: null
  });
  return result;
};
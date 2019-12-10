const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
/**
* An HTTP endpoint that acts as a webhook for Twilio sms.received event
* @param {object} event
* @returns {object} result The result of your workflow steps
*/
module.exports = async (event) => {
  if (event.Body.trim().split(',').length !== 1) {
    return;
  }

  // Prepare workflow object to store API responses

  let result = {};

  // [Workflow Step 1]

  console.log(`Running airtable.query[@0.4.2].select()...`);

  result.step1 = {};
  console.log({
    table: `Workout`,
    where: [
      {
        'Day': Number(event.Body.trim())
      }
    ],
    typecast: true
  })
  result.step1.selectQueryResult = await lib.airtable.query['@0.4.2'].select({
    table: `Workout`,
    where: [
      {
        'Day': Number(event.Body.trim())
      }
    ],
    typecast: true
  });
  
  console.log(result.step1.selectQueryResult)
  if (result.step1.selectQueryResult.rows.length === 0) {
    return {'message': 'No workout found. Please check the workout table and try again.'};
  }

  // [Workflow Step 2]

  console.log(`Running twilio.messages[@0.1.1].create()...`);

  result.step2 = {};
  
  let body = result.step1.selectQueryResult.rows.map((row, index) => {
    return `Workout #${index + 1}:\nExercise: ${row.fields.Exercise} Sets: ${row.fields.Sets} Reps: ${row.fields.Repetitions} Tips: ${row.fields.Tips}\nWatch a Quick Video: ${row.fields.Video}`
  }).join('\n\n');
  
  result.step2.returnValue = await lib.twilio.messages['@0.1.1'].create({
    from: null,
    to: `${event.From}`,
    body: body,
    mediaUrl: null
  });

  return result;
};
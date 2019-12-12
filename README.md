# Build a Fitness Planner + Tracker with Airtable and Twilio

A measurable fitness goal and a tracking tool will keep you accountable, motivated, and help you push your limits. Perhaps your fitness goal is to be stronger; you'll need to have a workout plan and gradually increase the number of sets, repetitions, and weight for each exercise.

In this guide, you'll learn how to set up a workflow to retrieve and log your workouts via text using Twilio and Airtable APIs. 

[<img src="https://media.giphy.com/media/SSiYuAc1jQj0NZ915l/giphy.gif" width="250">]

The workflow will run on [Standard Library](https://stdlib.com), a
free-to-use API and workflow hosting platform, **powered by Node.js**, that will
use this repository as its project structure. Standard Library will automatically
handle Twilio and Airtable API authentication / webhook signing and more for you, so you can
focus on just writing and modifying logic.

# Example Usage

Once set up you'll text "1" to your Twilio number, and you will receive an SMS with Exercise, Sets, Repetitions, Tips, and Video for all rows in your Airtable that match Day 1. 

You'll log notes for every exercise by texting back the Day #, Excercise, Notes, Date separated by a comma, for example:

 `1, Barbell Squats, Completed 5 Sets 12 repetitions,`
 
# Table of Contents

1. [How It Works](#how-it-works)
1. [Installation](#installation)
1. [Making Changes](#making-changes)
1. [Support](#support)
1. [Acknowledgements](#acknowledgements)

# How It Works
This application sets up a simple webhook response to events on Twilio and then makes requests to Airtable's APIs. Standard Library's platform automatically handles webhook signing, routing, and authentication.

The stdlib.json file contained in this repository automatically tells Standard Library to configure the webhook routing, and sets a webhook timeout.

```json
{
  "name": "janethl/fitness-tracker",
  "timeout": 20000,
  "version": "0.0.0",
  "description": "",
  "events": [{
      "twilio.sms.received": {
        "filename": "events/twilio/sms/received",
        "subtype": null
      }
    },
    {
      "twilio.sms.received": {
        "filename": "events/twilio/sms/log",
        "subtype": null
      }
    }
  ]
}
```
The file `/functions/events/twilio/sms/received.js` exports a webhook (a web API)
that will handle the event from `stdlib.json`. It makes an  API requests to Airtable to select all rows in Airtable matching the number you texted and will return airtable fields via Twilio's API. 

The file `/functions/events/twilio/sms/log.js`also exports a webhook that triggers anytime you text your Twilio number to log a workout.  When your number receives a  text as a string separated by commas ("day, exercise, notes"), it will interpret your text and run the Airtable API that allows you to update rows by querying a base.


# Installation

To get you set up faster, I'll share my Airtable base for a 12-week workout plan. After you complete this tutorial, you can modify the fields and workouts to your liking. For now, I'd recommend you continue following along. Once you log in to Airtable, copy my Airtable base by clicking this link: https://airtable.com/addBaseFromShare/shro85XYtmV0cU09V

<img src= "https://cdn-images-1.medium.com/max/1440/1*WwclEHI2sy6hH_Leu2RVdw.png" width="400">

This Airtable is organized by grouping Days in Field 1. For each day, there are 5 to 6 exercises. 
You'll also notice a field titled "Notes", this is where your notes will log after completing every exercise. 
Now that you've copied my base, you're ready to deploy the code that will power your workflow. 

[<img src="https://deploy.stdlib.com/static/images/deploy.svg" width="192">](https://deploy.stdlib.com/)

You will be prompted to sign up (or login) to Standard Library at this stage. Once signed in you'll see a page like this:

<img src= "https://cdn-images-1.medium.com/max/1600/1*BUX8gQw4_PeByiuicbMsSA.png" width="400">

The `Events` table describes the events that kick off your workflow and the API endpoints that respond to events. For this project notice how we have two events here. The first **sms.received** event on Twilio sets off the Airtable API that selects all rows in Airtable matching the number you requested and will return Airtable fields via Twilio's API that sends a message. 

The second **sms.received** event triggers anytime you text your Twilio number to log a workout.  When your number receives a  text as a string separated by commas ("day, exercise, notes"), it will interpret your text and run the Airtable API that allows you to update rows by querying a base.

Next, we'll need to link our Airtable and Twilio accounts to a [Standard Library Identity](https://docs.stdlib.com/identity-management-sso-for-apis/what-is-an-identity-token/).

<img src= "https://cdn-images-1.medium.com/max/1600/1*pJfnk31tcd4l0A_xmhyvPA.png" width="400">

Standard Library provides [Identity Tokens](https://docs.stdlib.com/identity-management-sso-for-apis/what-is-an-identity-token/) that securely store and manage credentials to third party APIs. Once you've linked your accounts to a Token, you'll be able to listen for events, access your API's resources to create workflows.

You'll need to click the **Link Resource** button to the right of **Airtable…**

<img src= "https://cdn-images-1.medium.com/max/1600/1*b-4GAor4KNwR36aTExVyhg.png" width="400">

On the following page, you'll see an option to **Link Resource**. Click it to proceed.


# Making Changes

# Shipping to Production

# Support

# Acknowledgements

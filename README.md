# Build a Fitness Planner + Tracker with Airtable and Twilio

[<img src="https://deploy.stdlib.com/static/images/deploy.svg" width="192">](https://deploy.stdlib.com/)

A measurable fitness goal and a tracking tool will keep you accountable, motivated, and help you push your limits. Perhaps your fitness goal is to be stronger; you'll need to have a workout plan and gradually increase the number of sets, repetitions, and weight for each exercise.

In this guide, you'll learn how to set up a workflow to retrieve and log your workouts via text using Twilio and Airtable APIs. 

<img src="https://media.giphy.com/media/SSiYuAc1jQj0NZ915l/giphy.gif" width="250">

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
1. [Test Your Workflow](#test-your-workflow)
1. [Making Changes](#making-changes)
   1. [via Web Browser](#via-web-browser)
   1. [via Command Line](#via-command-line)
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

Input a name that you'll associate with your Airtable account for future workflows you'll create. I'd suggest inputting the email you used when signing up for Airtable. Next, follow the instructions to retrieve your Airtables API key.

<img src= "https://cdn-images-1.medium.com/max/1600/1*l3NaQEDTUi9Rk5VYR8uwUA.png" width="400">

Select the blue **"Finish"** button.

Find and Select the table titled **" 💪 Personal Gym App" and click "Finish".**

<img src= "https://cdn-images-1.medium.com/max/1600/1*MwgU0t0RhPRyU9onFzmcbw.png" width="400">

Congrats! You're done linking Airtable. Next, you'll want to click the "Link Resource" button to the right of Twilio…

<img src= "https://cdn-images-1.medium.com/max/1600/1*1QBMdj3bKL2-Qa0iu82Syg.png" width="400">

Click **"Link New Resource"** to start the [Twilio Connect flow](https://support.twilio.com/hc/en-us/articles/223135007-What-is-Twilio-Connect-). You'll need to log into Twilio, or create an account if you don't have one.

While Twilio offers a **free** account and a **free** Trial number, you're required to upgrade to connect your Twilio number to third-party apps. When you [upgrade](https://support.twilio.com/hc/en-us/articles/360006956594-Twilio-Third-Party-Application-and-Product-Support?_ga=2.101194177.1570860565.1575656764-1537879910.1573753850), Twilio will request that you add your credit card and will top your balance at $20. Twilio will deduct $0.0075 for every message you send.

<img src= "https://cdn-images-1.medium.com/max/1600/1*HosxabLAC5ODIK7BkzCttA.png" width="400">

Once you're logged in, you'll be asked to pick a phone number to associate with your workflow:

<img src= "https://cdn-images-1.medium.com/max/1600/1*w_iulfxC5Fzfa7C0SuBgug.png" width="400">

**Note**: If you already have a Twilio account and own a few numbers, they won't appear under "**Numbers you own."** When you authorized with the Standard Libary Twilio connect app, a new sub-account was created within your Twilio account. When you purchase a number from the above screen, it will be available on the sub-account, but **not** to your main account. You can read more about how [Twilio Connect apps work here](https://support.twilio.com/hc/en-us/articles/223135007-What-is-Twilio-Connect-).

After you choose a number and click **"Finish,"** you'll be brought back to the **Identity Management** screen:

<img src= "https://cdn-images-1.medium.com/max/1600/1*DnZuY_C3xxjxTd73jwymyQ.png" width="400">

And just like that, we're done with the authentication process! We no longer have to spend hours reading over docs to figure out how to authenticate into each third-party API, Standard Library has stream-lined the process of building an intricate application that connects multiple API accounts. 🙌🏼

We can now click **"Deploy Project"** to ship the code that powers our fitness tracking app to Standard Library.

<img src= "https://cdn-images-1.medium.com/max/1600/1*Zwdr6KIFVXmRkjinCWNBkQ.png" width="400">

# Test Your Workflow

Test the first part of your workflow by texting your Twilio number *"1",* If you set everything correctly, you will receive a text similar to this:

<img src= "https://cdn-images-1.medium.com/max/1600/1*ROZ6E6FpMn9FPAkpfM9pNA.jpeg" width="250">

To log notes after completing every exercise, text back the **day, exercise, and notes** you'd like to log. For Example:

<img src= "https://cdn-images-1.medium.com/max/1600/1*_1rOm5rCoKsTTOuYw9hZkQ.png" width="250">

When you text back the day, exercise, notes, your notes should successfully log in to your airtable base:


<img src= "https://cdn-images-1.medium.com/max/1600/1*WwclEHI2sy6hH_Leu2RVdw.png" width="400">

# Making Changes

There are two ways to modify your application. The first is via our in-browser
editor, [Code on Standard Library](https://code.stdlib.com/). The second is
via the [Standard Library CLI](https://github.com/stdlib/lib).

## via Web Browser

Simply visit [`code.stdlib.com`](https://code.stdlib.com) and pick your project
from the left sidebar. You can easily make updates and changes this way, and
deploy directly from your browser.

## via Command Line

You can either export your project via tarball by right-clicking the project
once open on [Code on Standard Library](https://code.stdlib.com/). You can then
install the CLI tools from [stdlib/lib](https://github.com/stdlib/lib) to test,
makes changes, and deploy.

```shell
# Deploy to dev environment
lib up dev
```

Alternatively, you can retrieve your package via `lib get`...

```shell
lib get <username>/<project-name>@dev
```

# Shipping to Production

Standard Library has easy dev / prod environment management, if you'd like to ship to production,
visit [`build.stdlib.com/projects`](https://build.stdlib.com/projects),
find your project and select it.

From the environment management screen, simply click **Ship Release**.

<img src="https://cdn-images-1.medium.com/max/1440/1*JqiwC6a_zbIdTsww1BOYLQ.png" width="400">

Link any necessary resources, specify the version of the release and click **Create Release** to proceed. 

That's all you need to do!

# Support

Via Slack: [`libdev.slack.com`](https://libdev.slack.com/)

You can request an invitation by clicking `Community > Slack` in the top bar
on [`https://stdlib.com`](https://stdlib.com).

Via Twitter: [@StdLibHQ](https://twitter.com/StdLibHQ)

Via E-mail: [support@stdlib.com](mailto:support@stdlib.com)

# Acknowledgements

Thanks to the Standard Library team and community for all the support!

Keep up to date with platform changes on our [Blog](https://stdlib.com/blog).

Happy hacking!

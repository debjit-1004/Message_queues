const {Worker} = require('bullmq');
const {QueueEvents} = require('bullmq');
const connection = require('./client');

const sendemail = ()=> new Promise((resolve, reject) => setTimeout(()=>resolve(), 5*1000));

const worker = new Worker('email-queue', async(job) => { 
  console.log('Message rec id', job.id);
  console.log('Processing')
  console.log('Sending email to ', job.data.email);
  console.log(job.data.body, job.data.subject);
  await sendemail();
  console.log('Email sent successfully');  
}, { connection });

// worker.on('completed', (job) => {
//   console.log(`${job.id} has completed!`);
// });

// worker.on('failed', (job, err) => {
//   console.log(`${job.id} has failed with ${err.message}`);
// });

const queueEvents = new QueueEvents('email-queue', { connection });

queueEvents.on('waiting', ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});

queueEvents.on('active', ({ jobId, prev }) => {
  console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on('completed', ({ jobId, returnvalue }) => {
  console.log(`${jobId} has completed and returned ${returnvalue}`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.log(`${jobId} has failed with reason ${failedReason}`);
});

queueEvents.on('progress', ({ jobId, data }, timestamp) => {
  console.log(`${jobId} reported progress ${data} at ${timestamp}`);
});
module.exports = {
    method: "PUT",
    path: "/applicants/{applicantId}/requirements/submit",
    config: {
      description: "View desscription",
      notes:
        "Used to mark a requirement as fully completed",
      tags: ["api"] // ADD THIS TAG
    },
    handler: function(request, response) {
      return {
        status: "SuccessSubmission",
        message:
          "The submission was received, a notification will be sent when it's completed"
      };
    }
  };
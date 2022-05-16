const asyncHandler = require("../middleware/async");
const EvaluationResponse = require("../models/EvaluationResponse");


exports.contractEvaluationScore = asyncHandler( async(contract, req, res, next) => {
  const evaluationResponses = await EvaluationResponse.find({contract: contract._id})
  const evaluationResponsesLength = evaluationResponses.length()
  let evaluationScore = 0
  let evaluationMaxScore  = 100 / evaluationResponsesLength

  for (const{response} of Object.entries(evaluationResponses)) {
    evaluationScore += response.score
  }

  const finalEvaluationScore = evaluationScore / evaluationMaxScore
  contract.score = finalEvaluationScore
  await contract.save()

  if (finalEvaluationScore == 0 || finalEvaluationScore >= 70) {
    return {
      score: finalEvaluationScore,
      terminated: false
    }
  } else {
    return {
      score: finalEvaluationScore,
      terminated: true
    }
  }
})
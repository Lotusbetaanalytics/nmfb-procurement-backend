const asyncHandler = require("../middleware/async");
const EvaluationResponse = require("../models/EvaluationResponse");


exports.contractEvaluationScore = asyncHandler( async(contract) => {
  const evaluationResponses = await EvaluationResponse.find({contract: contract._id})
  const evaluationResponsesLength = evaluationResponses.length
  // let evaluationScore = 0
  const evaluationMaxScore  = 100 / evaluationResponsesLength

  // calculate evaluation score
  // for (const[key, response] of Object.entries(evaluationResponses)) {
  //   evaluationScore += response.score
  // }

  // calculate evaluation score
  const evaluationScore = evaluationResponses.reduce((total, instance) => {
    return total + instance.score
  })

  // calculate final evaluation score
  const finalEvaluationScore = evaluationScore / evaluationMaxScore
  // save score to contract
  contract.score = finalEvaluationScore
  await contract.save()

  const result = {
    score: finalEvaluationScore,
    terminated: true
  }

  if (finalEvaluationScore == 0 || finalEvaluationScore >= 70) {
    result.terminated = false
  }
  return result
})
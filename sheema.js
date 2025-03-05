const joi = require('joi')
module.exports.schema=joi.object({
    listings:({
        tilte:joi.string().required(),
        description:joi.string().required(),
        description:joi.string().required(),
        price :joi.string().required().min(0),
        location:joi.string().required(),
        country:joi.string().required(),
        image:joi.string().allow("",null)
    })
})
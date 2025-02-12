const z=require('zod')

const createuserSchema=z.object({
    email:z.string().min(3).email(),
    password:z.string(),
    name:z.string()

})
const signInSchema=z.object({
    email:z.string(),
    password:z.string()

})
const roomSchema=z.object({
    name:z.string().min(3).max(20)
})

module.exports={createuserSchema,signInSchema,roomSchema}
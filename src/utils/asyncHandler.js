// const  asncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
//     }
// }


export {asncHandler}


const asncHandler = (func) => async (req, res, next) => {
    try{

    } catch (error){
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
        console.log("errorrrr: ", error)
    }
}
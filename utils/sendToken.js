let sendToken = async(user, res, message, statusCode) => {
    let token = await user.getJWT()

    let options = {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        sameSite: process.env.NODE_ENV === 'development' ? 'lax': 'none',
        secure: process.env.NODE_ENV === 'development' ? false : true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true, 
        message
    })
}

export default sendToken
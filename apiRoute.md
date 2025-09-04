# dev-tinder api

## authRouter

- POST /singup
- POST /login
- POST /logout

## profileRouter

- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

## connectionRequestRouter

- POST /connection/send/interested/:userId
- POST /connection/send/ignored/:userId
- POST /connection/review/accepcted/:requestId
- POST /connection/review/rejected/:requestId

## userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feeds get the others users profile on our plateform

status interested ,ignored , accecpted, rejected

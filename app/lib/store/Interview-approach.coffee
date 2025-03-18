// we have matin for error as well sucess ( feedaback of a question) 
// 1) old question displayed in background
// 2) persisit the feednack states (mongoDB)


// user schema {
//     username :string
//     score : 
//     attemptQutions : [{questionID , feedback: {attempted : ATTEMPTED , correct?: boolean } ], // false true

// }

enums {
    ATTEMPTED = 1
    NOTATTEMPED = 0
}

 
/* 
  
1) every time i am getting new qeustion ( store the asked in DB - ids)
2)  

    questionIDs-> [] -> persistant state -> make query to db and fetch the question
    feedbacks -> [1,0,1] -> persistant state -> i will show feedback to user
 
    attemptQutions -> [{questionID:1, feedback:true},{questionID:2, feedback:fasle}] -> persistant state -> i will show feedback to user

  [].pop() -> lastest question 
   for showing pop-up -> attempted (true | false) -> ()

   enum: ['notattempted', 'Correact', 'incorrect'],
   if(feedback.coorrect){
     success-> pop-up()
   }
     if(feedback.incorrect){
        error -> pop-up()
     }
     if(feedaback.attempted){
        not show  any  -> pop-up
     }
   

   1) will have to trak user question without resgisttered

   sol : unique URL for every user so we have cross browser copmpatability


  /8hkl -> unregistered user session 

  code : unique , 8hkl
  attemptedQuestion : []

  game -> API route -> UI route

  / -> home ( call users api -> if it is resgisttered -> normal flow )
  call usr api -> not resgisttered -> redirect to /[code] url component


    user schema -> game schema ( )
 
    fasle -> creat games collection -> ( code ,expries) -> 
    /api/game -> GET ->
*/
import express from 'express';
import { graphqlHTTP as expressgraphql } from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
const app = express();


const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name:'HelloWorld',
        fields:{
            message:{type:GraphQLString,
                resolve(){
                    return "Hello World"
                }
            },
        }
    }
    )
}
)

app.use('/graphql', expressgraphql({
    schema:schema,
  graphiql:true
}))
app.listen(5000, () => console.log('Server started'));

import express from 'express';
import { graphqlHTTP as expressgraphql } from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType, GraphQLString,GraphQLInt,GraphQLNonNull, GraphQLList} from 'graphql';
const app = express();

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const BookType = new GraphQLObjectType({
    name:"Book",
    description:'This represents a book written by an author',
    fields:()=> ({
        id:{type:new GraphQLNonNull(GraphQLInt)},
        name:{type:new GraphQLNonNull(GraphQLString)},
        authorId:{type:new GraphQLNonNull(GraphQLInt)},
        author:{
            type:AuthorType,
            resolve:(book)=>{return authors.find(author=>author.id===book.authorId)}
        }
    })
})


const AuthorType = new GraphQLObjectType({
    name:"author",
    description:'This represents a author of a book',
    fields:()=>({
        id:{type:new GraphQLNonNull(GraphQLInt)},
        name:{type:new GraphQLNonNull(GraphQLString)},
        books:{
            type: new GraphQLList(BookType),
            description:'List of Books Written By This Author',
            resolve:(author)=>{return books.filter(book=>book.authorId===author.id)}
        }
    })
})


    
const RootQueryType = new GraphQLObjectType({
	name:'RootQueryType',
    description:'Root Query',
	fields: () => ({
        book:{
            type:BookType,
            description:'A Single Book',
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(parent,args)=>{
                return books.find(book=>book.id===args.id)
            }
        },
        books:{
            type: new GraphQLList(BookType),
            description:'List of all books',
            resolve: () => books
        },
        authors:{
            type: new GraphQLList(AuthorType),
            description:'List of all authors',
            resolve: () => authors
        },
    })
});

const RootMutationType = new GraphQLObjectType({
    name:'RootMutationType',
    description:'Root Mutation',
    fields: () => ({

        addBook: {
            type:BookType,
            description: "Add new book",
            args : { 
                name:{type:new GraphQLNonNull(GraphQLString)},
                authorId:{type:new GraphQLNonNull(GraphQLInt)}
            },
            resolve:(parent,args)=>{
                const book={
                    id:books.length+1,
                    name:args.name,
                    authorId:args.authorId
                };
                books.push(book);
                return book;
            } 
        },
        addAuthor: {
            type:AuthorType,
            description: "Add new author",
            args : { 
                name:{type:new GraphQLNonNull(GraphQLString)},
            },
            resolve:(parent,args)=>{
                const author={
                    id:authors.length+1,
                    name:args.name,
                   
                };
                authors.push(author);
                return author;
            } 
        }
    })
}) 

const schema = new GraphQLSchema({
    query:RootQueryType,
    mutation:RootMutationType
})

app.use('/graphql', expressgraphql({
    schema:schema,
  graphiql:true
}))
app.listen(5000, () => console.log('Server started'));

//import { Mongoose } from 'mongoose';
import mongoose from 'mongoose';
import { Password } from "./utilities/password";

// a user interface FOR EFFECTIVE USER TYPE CHECKING
interface UserAttrs {
    email: string;
    password: string;
    username: string
}

//interface that defines what the properties of a user are
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs) : UserDoc;
}

//interface that describes the properties of a user document
interface UserDoc extends mongoose.Document {
    username: string;
    email: string;
    password: string;
}

//user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
    
},
{
    // toJSON: {
    //     transform(doc, ret) {
    //         ret.id = ret._id;
    //         delete ret._id;
    //         delete ret.password;
    //         delete ret.__v;
    //         // delete ret.created_at;
    //         // delete ret.updated_at;
    //     }
    // },
    
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const hashedpassword = await Password.hashPassword(this.get('password'));
        this.set('password', hashedpassword);
    }
    next();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User, UserModel, UserDoc };
import {
	model,
	Schema,
	Document,
	SchemaTypes,
	UpdateQuery,
	QueryOptions,
} from 'mongoose'

interface IUser extends Document {
	userID: string
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
	userID: { type: SchemaTypes.String, required: true },
})

const UserModel = model('users', UserSchema)

const findOrCreate = async (values: QueryOptions<IUser>) => {
	const user = UserModel.findOne(values)

	if (user === null) {
		return new UserModel(values).save().then((user) => user.toObject())
	}

	return user
}

const getUser = (userID: string) => UserModel.findOne({ userID })

const createUser = (values: Partial<IUser>) =>
	new UserModel(values).save().then((user) => user.toObject())
const deleteUser = (userID: string) => UserModel.findOneAndDelete({ userID })
const updateUser = (userID: string, values: UpdateQuery<IUser>) =>
	UserModel.findOneAndDelete({ userID }, values)

export default {
	UserModel,
	findOrCreate,
	getUser,
	createUser,
	deleteUser,
	updateUser,
}

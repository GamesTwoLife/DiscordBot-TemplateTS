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

const findOrCreate = async (values: UpdateQuery<IUser>) => {
	let user = await UserModel.findOne(values)

	if (!user) {
		user = new UserModel(values)
		await user.save()
	}

	return user
}

const getUser = (userID: string) => UserModel.findOne({ userID })

const createUser = (values: Partial<IUser>) =>
	new UserModel(values).save().then((user) => user.toObject())
const deleteUser = (userID: string) => UserModel.findOneAndDelete({ userID })
const updateUser = (userID: string, values: UpdateQuery<IUser>) =>
	UserModel.findOneAndUpdate({ userID }, values, { upsert: true })

export default {
	UserModel,
	findOrCreate,
	getUser,
	createUser,
	deleteUser,
	updateUser,
}

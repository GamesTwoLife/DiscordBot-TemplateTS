import { model, Schema, Document, SchemaTypes, UpdateQuery } from 'mongoose'

interface IInteraction extends Document {
	guildID: string
	interactionMessageId: string
	expiresAt: Date
}

const InteractionSchema: Schema<IInteraction> = new Schema<IInteraction>({
	guildID: { type: SchemaTypes.String, required: true },
	interactionMessageId: { type: SchemaTypes.String, required: true },
	expiresAt: { type: SchemaTypes.Date, required: true },
})

const InteractionModel = model('interactions', InteractionSchema)

const getInteraction = (guildID: string, interactionMessageId: string) =>
	InteractionModel.findOne({ guildID, interactionMessageId })

const createInteraction = (values: Partial<IInteraction>) =>
	new InteractionModel(values).save().then((user) => user.toObject())
const deleteInteraction = (guildID: string, interactionMessageId: string) =>
	InteractionModel.findOneAndDelete({ guildID, interactionMessageId })
const updateInteraction = (
	guildID: string,
	interactionMessageId: string,
	values: UpdateQuery<IInteraction>
) =>
	InteractionModel.findOneAndUpdate({ guildID, interactionMessageId }, values)

export default {
	InteractionModel,
	getInteraction,
	createInteraction,
	deleteInteraction,
	updateInteraction,
}

export class ResponseTransform {
	static response(data) {
		return {
			id: data.id,
			heading: data.title,
			news: data.content,
			user_id: data.user_id,
			image: `${process.env.APP_URL}/images/${data.image}`,
			created_at: data.created_at,
			updated_at: data.updated_at,
			reporter: {
				id: data.user.id,
				name: data.user.name,
				email: data.user.email,
				profile:
					data.user?.profile !== null
						? `${process.env.APP_URL}/images/${data.user.profile}`
						: null,
			},
		};
	}
}

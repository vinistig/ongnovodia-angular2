

define(function () {

	return {

		baseUrl: 'http://localhost:3000/#/',

		validAdmin: {
			email: 'breakingbug@br.ibm.com'
		},

		loginStub: {
			invalidAdminUser: {
				email: 'joao2312@br.ibm.com',
				password: 'senhajoao'
			},
			invalidEmailFormat: {
				email: 'joao2312.br.ibm.com',
				password: 'senhajoao'
			}
		},

		adminStub: {
			adminUrl: 'admin',
			validBluepagesId_1: {
				email: 'adpalad'
			},
			validBluepagesId_2: {
				email: 'danmart'
			},
			invalidBluepagesId: {
				email: 'sdpoakw'
			}
		},

		groupsStub: {
			groupsUrl: 'groups',
			invalidUrl: '/i_dont_exists'
		},

		newGroupStub: {
			newGroupsUrl: 'groups/new',
			validNonAdminUser: {
				email: 'pedrolim'
			},
			invalidNonAdminUser: {
				email: 'sdpoakw'
			},
			groupName: 'Intern Group Name Test 1',
			texts: {
				descriptionText: 'An sit delenit temporibus, minim vitae per ne, accumsan fabellas senserit ex ius. Minim movet instructior te est, viderer bonorum in vis. Eu tollit menandri mea, at ius purto zril. Nusquam persecuti pro cu. Etiam tation senserit eos ex, his ut laoreet blandit. Pri tibique verterem in, commune maiestatis per ex, illud recteque accusamus his no. Vis case blandit mediocrem id, usu virtute scaevola consequat ei.'
			}
		},

		newChannelStub: {
			name: 'Intern Channel Name Test 1-',
			texts: {
				description: 'An sit delenit temporibus, minim vitae per ne, accumsan fabellas senserit ex ius. Minim movet instructior te est, viderer bonorum in vis. Eu tollit menandri mea, at ius purto zril. Nusquam persecuti pro cu. Etiam tation senserit eos ex, his ut laoreet blandit. Pri tibique verterem in, commune maiestatis per ex, illud recteque accusamus his no. Vis case blandit mediocrem id, usu virtute scaevola consequat ei.'
			}
		},

		channelDetailsStub: {
			groupDetailsUrl: "groups/details",
			channelDetailsUrl: "channels/details",
			group: {
				name: "AAA - Group CD 1",
				description: "Group for testing channel details feature"
			},
			channel: {
				name: "A - Channel details - simple",
				description: "A simple channel"
			},
			privateChannel: {
				name: "B - Channel details - private",
				description: "A private channel"
			},
			primaryChannel: {
				name: "C - Channel details - primary",
				description: "A primary channel"
			},
			invalidBluepagesId: 'sdpoakw',
		},

		editChannelStub: {
			name: 'Intern Channel Name TestEdit 1 -',
			texts: {
				description: 'An sit delenit temporibus, minim vitae per ne, accumsan fabellas senserit ex ius. Minim movet instructior te est, viderer bonorum in vis. Eu tollit menandri mea, at ius purto zril. Nusquam persecuti pro cu. Etiam tation senserit eos ex, his ut laoreet blandit. Pri tibique verterem in, commune maiestatis per ex, illud recteque accusamus his no. Vis case blandit mediocrem id, usu virtute scaevola consequat ei.'
			}
		},

		bulkUserStup: {
			absolutePath: '/Users/thiagogs/Documents/wks/github/share2win', //DO NOT PUT A SLASH AT THE END
		},
	};
});

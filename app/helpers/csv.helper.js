/**
 * Will handle the csf file used on bulk feature
 */
class CSVHandler {
	/**
	 * Initiate the CSV Handler class and starts counter variables
	 * @param  {object} file The csv file from front-end
	 * @return {CSVHandler} An object from CSV Handler
	 */
	constructor(file){
		this.file       = file

		this.toInsert   = 0
		this.inserted   = 0
		this.duplicated = 0
		this.invalid    = 0
	}

	/**
	 * Will get the content of the file and convert it to an array, also will remove duplicated or invalid entries
	 * @return {array} A valid array with the content of the file
	 */
	toArray(users){
		let validEmail = new RegExp(/^(([^$<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)
		let alreadyExists = (users && Array.isArray(users)) ? users : []
		let fileString = this.file.buffer.toString()

		if (fileString.trim()==='') { return } //file is empty 

		let array = fileString.split(/\r/g)

		this.toInsert = array.length

		if (Array.isArray(array) && array.length > 0) {
			let tmpArray = []
			for (let email of array) {
				email = email.toLowerCase().trim()

				if (alreadyExists.indexOf(email) < 0) { 
					alreadyExists.push(email)

					if (validEmail.test(email)) {
						tmpArray.push(email)
					} else {
						this.invalid++
						continue
					}
				} else {
					this.duplicated++
					continue
				}
			}

			this.inserted = tmpArray.length
			return tmpArray
		}
	}

	/**
	 * Will return the totals of users inserted
	 * @return {object} Return the totals about how the class worked into the array
	 */
	getStatus(){
		return {
			toInsert:   this.toInsert,
			inserted:   this.inserted,
			duplicated: this.duplicated,
			invalid:    this.invalid
		}
	}
}

module.exports = CSVHandler
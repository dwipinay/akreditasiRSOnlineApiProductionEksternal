class Pagination {
    constructor(data, page, limit) {
        this.data = data
        this.page = parseInt(page)
        this.limit = parseInt(limit)
    }

    getRemarkPagination(){
        const startIndex = (this.page - 1) * this.limit
        const endIndex = this.page * this.limit
        const remarkPagination = {}

        remarkPagination.total_number_of_pages = Math.ceil((this.data.length) / this.limit)
        remarkPagination.current_page = this.page

        if (endIndex < this.data.length) {
            remarkPagination.next = {
                page: this.page + 1,
                limit: this.limit
            }
        }

        if (startIndex > 0) {
            remarkPagination.previous = {
                page: this.page - 1,
                limit: this.limit
            }
        }

        return remarkPagination
    }

    getDataPagination() {
        const startIndex = (this.page - 1) * this.limit
        const endIndex = this.page * this.limit

        const dataPagination = this.data.slice(startIndex, endIndex)
        return dataPagination
    }
}

module.exports = Pagination
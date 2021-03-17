class Buyer {
    constructor(market) {
        this.market = market;
        this.quantities = [0, 0] // initialialized like this just for this particular case, i know its not general
        this.prices = [0, 0]
        this.total = 0
    }
    

    /**
     * This method should get the best price for a given product 
     * across all sellers
     */
    getBestPrice(product) {
        let minPrice = 999999999
        this.market.sellers.forEach(element => {
            if (product in element.inventory) {
                minPrice = element.inventory[product].price < minPrice ? element.inventory[product].price : minPrice
            }
        });
        if (minPrice === 999999999) throw Error('The product was not found') 
        return minPrice
    }


    /**
     * This method should optimise price when filling an order
     * if the quantity is greater than any single seller can accomodate
     * then the next cheapest seller should be used.
     */
    calculateTotal() {
        let it = 0
        this.quantities.forEach(() => {
            this.total += this.quantities[it] * this.prices[it]
            it += 1
        })
        return this.total
    }

    getSecondBestPrice(product, lastPrice) {
        let minPrice = 999999999
        this.market.sellers.forEach(element => {
            if (product in element.inventory) {
                if (element.inventory[product].price !== lastPrice) {
                    minPrice = element.inventory[product].price < minPrice ? element.inventory[product].price : minPrice
                }
            }
        }); 
        return minPrice
    }

    quicklyFill(product, quantity) {
        let totalPrice = 0
        let remainedQuantity
        let bestPrice = this.getBestPrice(product)
        let secondBestPrice = this.getSecondBestPrice(product, bestPrice)
        this.market.sellers.forEach(seller => {
            if (product in seller.inventory) {
                    if (seller.inventory[product].price === bestPrice) {
                        this.quantities[0] = quantity
                        this.prices[0] = seller.inventory[product].price
                        remainedQuantity = seller.inventory[product].quantity - quantity
                        if (remainedQuantity < 0) {
                            this.market.sellers.forEach(secondSeller => {
                                if (product in secondSeller.inventory) {
                                    if (secondSeller.inventory[product].price === secondBestPrice) {
                                        this.quantities[1] = remainedQuantity * -1
                                        this.prices[1] = secondSeller.inventory[product].price
                                    }
                                }
                            })
                        }
                        for (let i = 0; i < this.quantities.length; i++) {
                            totalPrice+= this.quantities[i] * this.prices[i]
                        }
                    }
            }
        })
        return totalPrice
    }


    /**
     * This method should optimise for sellers with the largest inventory when filling an order
     * if the quantity is greater than any single seller can accomodate
     * then the next largest seller should be used.
     * if multiple sellers have the same amount of inventory
     * you should use the cheaper of the two.
     */

    getLargestQuantity(product) {
        let max = 0
        this.market.sellers.forEach(element => {
            if (product in element.inventory) {
                max = element.inventory[product].quantity > max ? element.inventory[product].quantity : max
            }
        });
        if (max === 0) throw Error('The product was not found') 
        return max
    }

    getSecondLargestQuantity(product, lastQuantity) {
        let max = 0
        this.market.sellers.forEach(element => {
            if (product in element.inventory) {
                if (element.inventory[product].quantity !== lastQuantity) {
                    max = element.inventory[product].quantity > max ? element.inventory[product].quantity : max
                }
            }
        }); 
        return max
    }

    completelyFill(product, quantity) {
        let totalPrice = 0
        let remainedQuantity
        let first = this.getLargestQuantity(product)
        let second = this.getSecondLargestQuantity(product, first)
        this.market.sellers.forEach(seller => {
            if (product in seller.inventory) {
                    if (seller.inventory[product].quantity === first) {
                        this.quantities[0] = quantity
                        this.prices[0] = seller.inventory[product].price
                        remainedQuantity = seller.inventory[product].quantity - quantity
                        if (remainedQuantity < 0) {
                            this.market.sellers.forEach(secondSeller => {
                                if (product in secondSeller.inventory) {
                                    if (secondSeller.inventory[product].quantity === second) {
                                        if (secondSeller.inventory[product].price === this.getBestPrice(product) || secondSeller.inventory[product].price === this.getSecondBestPrice(product)) {
                                            this.quantities[1] = remainedQuantity * -1
                                            this.prices[1] = secondSeller.inventory[product].price  
                                        }
                                    }
                                }
                            })
                        }
                        for (let i = 0; i < this.quantities.length; i++) {
                            totalPrice+= this.quantities[i] * this.prices[i]
                        }
                    }
            }
        })
        return totalPrice
    }
}

module.exports = {Buyer}

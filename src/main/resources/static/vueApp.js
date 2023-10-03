const { createApp } = Vue
const baseUrl = "http://localhost:8080/coin/"
const maincontainer = {
    data(){
        return{
            coins: [],
            canSeeTransactions: false,
            formCoin: {
                isNew: true,
                name: '',
                price:  '',
                quantity: '',
                title: 'Cadastrar nova moeda',
                button: 'Cadastrar'
            },
            transactions: []
        }
    },

    mounted(){
        this.showAllCoins()
    },

    methods:{
        showAllCoins(){
            axios
                .get(baseUrl)
                .then(response => {
                    response.data.forEach(itens => {
                        this.coins.push(itens)
                    })
                })
        },

        showTransactions(name){
            this.transactions = {
                coinName: name,
                data: []
            }

            this.canSeeTransactions = true;

            axios
                .get(baseUrl + name)
                .then(response => {
                    response.data.forEach(item => {
                        this.transactions.data.push({
                            id:         item.id,
                            name:       item.name,
                            price:      item.price.toLocaleString('pt-br', {style:'currency',currency:'BRL'}),
                            quantity:   item.quantity,
                            dateTime:   dayjs(this.dateTime).format('DD-MM-YYYY HH:mm')
                        })
                    })
                    .catch(function (error){
                        toastr.error(error)
                    })
                })
        },

        

        saveCoin(){

            const self = this

            if (this.formCoin.isNew){

                this.coins = [];
                this.formCoin.name = this.formCoin.name.toUpperCase();
                this.formCoin.price = this.formCoin.price
                    .replace("R$", '')
                    .replace(',', '.').trim()

                if (this.formCoin.name == '' || this.formCoin.price == '' || this.formCoin.quantity == ''){
                    toastr.error('Todos os campos devem ser preenchidos')
                    return
                }

                const coin = {
                    name: this.formCoin.name,
                    price: this.formCoin.price,
                    quantity: this.formCoin.quantity
                }

                axios
                    .post(baseUrl, coin)
                    .then(function(response){
                        toastr.success('Moeda cadastrada com sucesso.', 'Formulário')
                    })
                    .catch(function(error){
                        toastr.error ('Não foi possível cadastrar uma nova moeda.', 'Formulário')
                    })
                    .then(function(){
                        self.showAllCoins();
                        self.cleanForm();
                        self.showTransactions(coin.name);
                })
            } else {

                this.coins = [];
                this.formCoin.name = this.formCoin.name.toUpperCase();
                this.formCoin.price = this.formCoin.price
                    .replace("R$", '')
                    .replace(',', '.').trim()

                if (this.formCoin.name == '' || this.formCoin.price == '' || this.formCoin.quantity == ''){
                    toastr.error('Todos os campos devem ser preenchidos')
                    return
                }

                const coin = {
                    id: this.formCoin.id,
                    name: this.formCoin.name,
                    price: this.formCoin.price,
                    quantity: this.formCoin.quantity
                }

                axios.put(baseUrl, coin)
                .then(function (response){
                    toastr.success("Transação atualizada com sucesso.", "Formulário")
                })
                .catch(function(error){
                    toastr.error("Não foi possível atualizar a transação" + error, "Formulário")
                })
                .then(function(){
                    self.showAllCoins();
                    self.cleanForm();
                    self.showTransactions(coin.name);
                })

            }
            
        },

        editTransactions(transactions){
            this.formCoin = {
                    isNew: false,
                    id: transactions.id,
                    name: transactions.name.toUpperCase(),
                    price:  transactions.price,
                    quantity: transactions.quantity,
                    title: 'Editar moeda',
                    button: 'Atualizar'
            }
        },


        removeTransaction(transactions){
            const self  = this
            this.coins = [];

            axios
                .delete(baseUrl + transactions.id)
                .then(function (response){
                    toastr.success('Transação removida com sucesso.', 'Exclusão')
                })
                .catch(function(error){
                    toastr.error("Não foi possível remover transação." + error, 'Exclusão')
                })
                .then(function(){
                    self.showAllCoins()
                    self.showTransactions(transactions.name)
                    self.cleanForm()
                })
        },

        cleanForm(){
                this.formCoin.isNew = true,
                this.formCoin.name = '',
                this.formCoin.price = '',
                this.formCoin.quantity = '',
                this.formCoin.title = 'Cadastrar nova moeda',
                this.formCoin.button = 'Cadastrar'
        }

    }
}
createApp(maincontainer).mount('#app')
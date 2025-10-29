<script>
import { useToast } from 'vue-toastification';
const showToast = useToast()

export default{
    props: {
        isOpen: Boolean,
        initialData: Object,
        item: []
    },
    emits: ["close", "submit", "update-item", "add"],
    data(){
        return {
            formData: {...this.initialData},
            errors: [],
        }
    },
    watch: {
        initialData: {
            handler(newData) {
                this.formData = {...newData}
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        close(){
            this.$emit("close")
        },
        checkForm(error) {
             console.log(this.formData)
            if (
                (this.formData.wear || this.initialData.wear) &&
                (this.formData.float || this.initialData.float) &&
                (this.formData.rarity || this.initialData.rarity)
            ) {
                this.$emit("submit", this.formData);
                this.close();
            }

            errors.value = [];

            if (!this.formData.wear || !this.initialData.wear) {
                this.errors.push('Please select weapon condition/wear')
            }
            if (!this.formData.float || !this.initialData.float) {
                this.errors.push('Float value missing')
            }

            if (!this.formData.rarity || !this.initialData.rarity) {
                this.errors.push('Rarity missing?')
            }

            error.preventDefault();
        }
    }
}
</script>

<template>
    <div v-if="isOpen" class="m-overlay" @click.self="close">
        <div class="m-content">
            <button class="m-close" @click="close"> X </button>
            
            <div class="m-container">
                <div class="m-c-img">
                    <img :src="initialData.image" />
                </div>

                <div class="m-form-c">


                    <form @submit="checkForm" method="post" novalidate="true">

                        <p v-if="errors.length">
                            <b> Please correct the following error(s): </b>
                        <ul>
                            <li v-for="error in errors"> {{ error }}</li>
                        </ul>
                        </p>
                        <h2>{{ initialData.name }} {{ initialData.itemName }} </h2>
                        
                        
                        <label>
                            User:
                            <select v-model="formData.userName">
                                <option :value=true>Pede</option>
                                <option :value=false>Vinne</option>
                            </select>
                        </label>

                        <label>
                            Wear/Condition:
                            <select v-model="formData.wear">
                                <option label="Factory New" value="Factory New"></option>
                                <option label="Minimal Wear" value="Minimal Wear"></option>
                                <option label="Field Tested" value="Field Tested"></option>
                                <option label="Well Worn" value="Well Worn"></option>
                                <option label="Battle Scarred" value="Battle Scarred"></option>
                            </select>
                        </label>


                        <label>
                            Float:
                            <input type="number" v-model="formData.float"
                                :placeholder="initialData.float || '0.07'"></input>
                        </label>


                        <span> StatTrack:</span> 
                        <label class="switch">
                          
                            <input type="checkbox" v-model="formData.statTrack">
                                <span class="slider round"></span>    
                        </input>
                        </label>

                        <label>
                            Skin Quality:
                            <select v-model="formData.rarity">
                                <option label="MIL-SPEC" value="Mil-Spec Grade"></option>
                                <option label="RESTRICTED" value="Restricted"></option>
                                <option label="CLASSIFIED" value="Classified"></option>
                                <option label="COVERT" value="Covert"></option>
                                <option label="EXTRAORDINARY" value="Extraordinary"></option>
                            </select>
                        </label>

                        <label>
                            Estimated Price:
                            <input type="number" v-model="formData.estimatedPrice"
                                :placeholder="initialData.estimatedPrice || '1€'"></input>
                        </label>



                        <button type="submit" class="form-btn-submit">Save</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="../assets/modal.scss" scoped></style>
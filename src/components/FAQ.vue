<script>
    export default{
           data(){
            return {
                openIndex: null,
            }
        },
        methods:{
            toggleAccordion(index) {
                this.openIndex = this.openIndex === index ? null : index;
            },
        },
        computed: {
           accordionClasses() {
            return (index) => ({
                'is-closed': this.openIndex !== index
            })
           }
        }
    };

</script>

<template>
    <section class="FAQ-container">
        <section class="FAQ">
        <div class="FAQ-header">
            <h3>FAQ</h3>
        </div>
        <div class="accordion-container">
            <div class="accordion-item is-primary" :class="accordionClasses(0)">
                <div class="accordion-title">
                    <p> How do I add a skin?</p>
                    <fa class="accordion-title-icon" icon="fa-plus-circle" @click="toggleAccordion(0)" />
                </div>
                <div class="accordion-content" v-show="openIndex === 0">
                    <div class="accordion-inner-content">
                        <span> To add a skin, simply search for the skin the in the top search bar. After finding the wanted skin, click on the skin image and fill out the form.</span>
                
                    </div>
                </div>
                </div>
            <div class="accordion-item is-primary" :class="accordionClasses(1)">
                <div class="accordion-title">
                <p>Why is the website loading so slow?</p>
                <fa class="accordion-title-icon"  icon="fa-plus-circle" @click="toggleAccordion(1)"/>
                </div>
                <div class="accordion-content">
                    <div class="accordion-inner-content"  v-show="openIndex === 1">
                    <span> This hobby project is built with free tools, meaning the backend has to cold-start if no requests have been recived recently.</span>
                    </div>
                </div>
            </div>
        </div>

    </section>
</section>


</template>

<style lang="scss" src="../assets/FAQAccordion.scss" scoped></style>
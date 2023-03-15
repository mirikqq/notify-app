<template>
    <div class="m2-welcome-msg">
        <img src="../../../assets/icon.png" alt="" class="m2-logo">
        <p>{{ user_name }}</p>
    </div>
</template>

<script>
import anime from 'animejs'

    export default { 
        name: 'WelcomeMsg',
        props: {
            user_name: {
                type: String
            }
        }, 
        mounted() {
            anime({
                targets: '.m2-welcome-msg',
                opacity: [
                    {value: 1, duration: 1000, easing: "linear"},
                    {value: 0, duration: 500, easing: "linear"},
                ],
                complete: () => {
                    this.$emit('welcomeShowed', true)
                    this.$el.style.display = 'none'
                }
            })
        }
    }
</script>

<style scoped>

    .m2-welcome-msg {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100vh;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: white;
        opacity: 0;
    }

    .m2-logo {
        width: 40px;
        border-radius: 50%;
    }

</style>
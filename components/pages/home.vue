<template>
	<view class="page-home">
		<text class="home-text">
			这是主页
		</text>
	</view>
</template>

<script>
	export default {
		name: "Home"
	}
</script>

<style lang="scss">
	$dis-text-color: #757575;
	
	.page-home {
		width: 100%;
		height: 45vh;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	.home-text {
		font-size: 28rpx;
		/* 可根据需要调整 */
		color: $dis-text-color;
	}
</style>
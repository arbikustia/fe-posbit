<!-- src/routes/unauthorized/+page.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
    
    
    function goToDashboard() {
        goto('/dashboard');
    }
    
    function goToLogin() {
        goto('/auth/login');
    }
</script>

<svelte:head>
    <title>Akses Ditolak - Unauthorized</title>
    <meta name="description" content="Anda tidak memiliki izin untuk mengakses halaman ini" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center items-center px-4 py-8">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-[1.02] transition-transform duration-300">
        <!-- Icon Container -->
        <div class="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-50">
            <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>
        
        <!-- Title & Message -->
        <h1 class="text-3xl font-bold text-gray-900 mb-3">Akses Ditolak</h1>
        <p class="text-gray-600 mb-2">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <p class="text-sm text-gray-500 mb-6">
            Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
        </p>
        
        <!-- Error Code -->
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mb-6">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error 403 - Forbidden
        </div>
        
        
    </div>
    
    <!-- Footer -->
    <div class="mt-8 text-center">
        <p class="text-xs text-gray-400">
            © {dayjs().year()} Bantuit. All rights reserved.
        </p>
    </div>
</div>

<style>
    /* Custom animations */
    button {
        transition: all 0.2s ease-in-out;
    }
    
    button:hover {
        transform: translateY(-1px);
    }
    
    /* Smooth appearance */
    div:first-child {
        animation: fadeIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
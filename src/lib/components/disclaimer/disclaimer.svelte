<script>
	import Icon from '@iconify/svelte';
	import Button from '../ui/button/button.svelte';
	const { close, hiddenClose } = $props();
</script>

<div class="mx-auto w-full font-sans text-gray-800">
	<h1
		class="mb-4 flex justify-between border-b border-blue-700 py-1 text-xl font-bold text-blue-700"
	>
		<span>DISCLAIMER</span>
		{#if !hiddenClose}
			<Icon
				onclick={() => close?.()}
				icon="material-symbols:close-rounded"
				width="30"
				height="30"
				class="cursor-pointer text-gray-500 transition-opacity hover:opacity-70"
			/>
		{/if}
	</h1>
	<div class="px-4">
		<h2 class="mb-2 mt-6 text-lg font-semibold">Acceptance of terms through use please read</h2>
		<p class="mb-4 text-sm">
			This web site is an electronic news and information service of OPSIGO. You may print and keep
			a copy of this Agreement. By using this site, you signify your agreement to all terms,
			conditions, and notices contained or referenced herein (the "Terms of Use"). It is your
			responsibility to access this document whenever you visit this web site to determine if there
			have been any changes to the terms of the Terms of Use. If you do not agree to these Terms of
			Use please do not access or use this site. We reserve the right, at our discretion, to update
			or revise these Terms and Conditions of Use at any time. Please check the Terms periodically
			for changes. Your continued use of this site following the posting of any changes to the Terms
			of Use constitutes acceptance of those changes.
		</p>

		<h2 class="mb-2 mt-6 text-lg font-semibold">Copyright</h2>
		<p class="mb-4 text-sm">
			All content included on this site, such as text, graphics, logos, button icons, images, and
			audio clips, digital downloads, data compilations, and software, is the property of OPSIGO or
			its content suppliers and protected by Indonesia and international copyright laws. The
			compilation of all content on this site is the exclusive property of OPSIGO and protected by
			Indonesia and international copyright laws. All software used on this site is the property of
			OPSIGO or its software suppliers and protected by Indonesia and international copyright laws.
		</p>

		<h2 class="mb-2 mt-6 text-lg font-semibold">Trademark</h2>
		<p class="mb-4 text-sm">
			OPSIGO is a registered trademark of OPSIGO in Indonesia and other countries. OPSIGO trademark
			and trade dress may not be used in connection with any product or service that is likely to
			cause confusion among customers, or in any manner that disparages or discredits OPSIGO. All
			other trademarks not owned by OPSIGO or its subsidiaries that appear on this site are the
			property of their respective owners, who may or may not be affiliated with, connected to, or
			sponsored by OPSIGO or its subsidiaries.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Proprietary rights</h3>
		<p class="mb-4 text-sm">
			You acknowledge and agree that all content and materials available on this site are protected
			by copyrights, trademarks, service marks, patents, trade secrets, or other proprietary rights
			and laws. Except as expressly authorized by OPSIGO, you agree not to sell, license, rent,
			modify, distribute, copy, reproduce, transmit, publicly display, publicly perform, publish,
			adapt, edit, or create derivative works from such materials or content. Notwithstanding the
			above, you may print or download one copy of the materials or content on this site on any
			single computer for your personal, non-commercial use, provided you keep intact all copyright
			and other proprietary notices. Systematic retrieval of data or other content from this site to
			create or compile, directly or indirectly, a collection, compilation, database or directory
			without written permission from OPSIGO is prohibited. In addition, use of the content or
			materials for any purpose not expressly permitted in these Terms of Use is prohibited. As
			noted above, reproduction, copying, or redistribution for commercial purposes of any materials
			or design elements on this site is strictly prohibited without the express written permission
			of OPSIGO.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">User's grant of limited license</h3>
		<p class="mb-4 text-sm">
			By posting or submitting content to this site, you: a) OPSIGO and its affiliates and licensees
			the right to use (in whole or part), reproduce, display, perform, edit, publish, translate,
			create derivative works from, adapt, modify, distribute, have distributed, and promote the
			content in any form, anywhere and for any purpose; and b) warrant and represent that you own
			or otherwise control all of the rights to the content and that public posting and use of your
			content by OPSIGO will not infringe or violate the rights of any third party. You also warrant
			that any «moral rights» in your material have been waived.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Disclaimer of warranties</h3>
		<p class="mb-4 text-sm">
			ALL MATERIALS, INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR AVAILABLE THROUGH
			THIS SITE (THE "CONTENT") ARE PROVIDED "AS IS" AND "AS AVAILABLE" FOR YOUR USE. THE SITE,
			INCLUDING, WITHOUT LIMITATION, ALL CONTENT, FUNCTIONS AND MATERIALS THEREON, IS PROVIDED "AS
			IS," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION,
			ANY WARRANTY FOR INFORMATION, DATA, DATA PROCESSING SERVICES, OR UNINTERRUPTED ACCESS, ANY
			WARRANTIES CONCERNING THE AVAILABILITY, ACCURACY, USEFULNESS, OR CONTENT OF INFORMATION, AND
			ANY WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY OR FITNESS FOR A PARTICULAR
			PURPOSE. OPSIGO DOES NOT WARRANT THAT THE SITE OR THE FUNCTIONS, FEATURES OR CONTENT CONTAINED
			THEREIN WILL BE TIMELY, SECURE, UNINTERRUPTED OR ERROR FREE, OR THAT DEFECTS WILL BE
			CORRECTED. OPSIGO MAKES NO WARRANTY THAT THE SITE WILL MEET USERS' REQUIREMENTS. NO ADVICE,
			RESULTS OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM OPSIGO OR THROUGH THE
			SITE SHALL CREATE ANY WARRANTY NOT EXPRESSLY MADE HEREIN. IF YOU ARE DISSATISFIED WITH THE
			SITE OR ANY CONTENT OR FUNCTION THEREON, YOUR SOLE REMEDY IS TO DISCONTINUE USING THE SITE.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Limitation of liabilities</h3>
		<p class="mb-4 text-sm">
			UNDER NO CIRCUMSTANCES SHALL OPSIGO OR ANY OF ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS,
			AFFILIATES, SUBSIDIARIES OR ITS LICENSORS BE LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE,
			INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES THAT RESULT FROM THE USE OF OR INABILITY TO USE,
			THIS SITE. THIS LIMITATION APPLIES WHETHER THE ALLEGED LIABILITY IS BASED ON CONTRACT, TORT,
			NEGLIGENCE AND STRICT LIABILITY, INCLUDING, WITHOUT LIMITATION, LOSS OF REVENUE, OR
			ANTICIPATED PROFITS OR LOST BUSINESS OR LOST SALES, EVEN IF OPSIGO HAS BEEN ADVISED OF THE
			POSSIBILITY OF SUCH DAMAGE. BECAUSE SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR
			LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, OPSIGO'S LIABILITY IN SUCH JURISDICTIONS
			SHALL BE LIMITED TO THE EXTENT PERMITTED BY LAW.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Indemnification</h3>
		<p class="mb-4 text-sm">
			Upon a request by OPSIGO, you agree to defend, indemnify, and hold harmless OPSIGO and its
			subsidiary and other affiliated companies, and their employees, contractors, officers, and
			directors from all liabilities, claims, and expenses, including attorney's fees that arise
			from your use or misuse of this site. OPSIGO reserves the right, at its own expense, to assume
			the exclusive defense and control of any matter otherwise subject to indemnification by you,
			in which event you will cooperate with OPSIGO in asserting any available defenses.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">International use</h3>
		<p class="mb-4 text-sm">
			OPSIGO makes no representation that materials on this site are appropriate or available for
			use in locations outside Indonesia, and accessing them from territories where their contents
			are illegal is prohibited. Those who choose to access this site from other locations do so on
			their own initiative and are responsible for compliance with local laws.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Internet access</h3>
		<p class="mb-4 text-sm">
			You acknowledge and agree that in connection with your use of the Site you must: (a) provide
			for your own access to the World Wide Web and pay any service fees associated with such
			access, and (b) provide all equipment necessary for you to make such access and connection to
			the World Wide Web, including a computer, software, a modem and a means of connecting to or
			accessing the Internet. OPSIGO shall not be responsible for any malfunctions, errors, crashes
			or other adverse events that may occur from your use of the Site.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Third party sites</h3>
		<p class="mb-4 text-sm">
			This site may produce automated search results or otherwise link you to other sites on the
			Internet. These sites may contain information or material that some people may find
			inappropriate or offensive. These other sites are not under the control of OPSIGO, and you
			acknowledge that OPSIGO is not responsible or liable directly or indirectly for the accuracy,
			copyright compliance, legality, decency, or any other aspect of the content of such sites. The
			inclusion of such a link does not imply endorsement of the site by OPSIGO or any association
			with its operators. Unsolicited Material Unless specifically requested, OPSIGO does not
			solicit nor does it wish to receive any confidential, secret or proprietary information or
			other material from you through the Site, any of its services, by e-mail, or in any other way.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Choice of law</h3>
		<p class="mb-4 text-sm">
			We control and operate this Site from our offices in Indonesia. Your use of this web site and
			all related rights and obligations, shall be governed by the Indonesia laws. Any legal action
			or proceeding with respect to this web site, related to these Terms and Conditions of use or
			any matter related thereto may be brought exclusively in the courts of Jakarta, Indonesia. By
			using this web site, you expressly agree and accept generally and unconditionally the
			jurisdiction of the aforesaid courts and irrevocably waive any objection to such jurisdiction.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Termination</h3>
		<p class="mb-4 text-sm">
			OPSIGO reserves the right, in its sole discretion, to terminate your access to all or part of
			this site, with or without notice.
		</p>

		<div class="mt-8 text-sm">
			© 2017 <span class="font-medium text-blue-800">OPSIGO</span> All rights reserved
		</div>
	</div>
</div>

<script>
	import Icon from '@iconify/svelte';
	import Button from '../ui/button/button.svelte';
	const { close, hiddenClose } = $props();
</script>

<div class="mx-auto w-full font-sans text-gray-800">
	<h1
		class="mb-4 flex justify-between border-b border-black py-1 text-xl font-bold text-neutral-700"
	>
		<span>PRIVACY AND POLICY</span>
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
		<h2 class="mb-2 mt-6 text-lg font-semibold">Applicability</h2>
		<p class="mb-4 text-sm">
			By accessing and using this site, your use indicates your agreement with the terms of this
			Policy. If you do not agree with this Policy, please do not use this site. This Policy is
			applicable to this and certain other OPSIGO web/mobile sites, but not necessarily, for which
			special terms and conditions may apply as indicated. All OPSIGO sites to which this Policy is
			applicable are collectively referred to as this "site". Note that special use terms, or site
			or page specific terms (referred to as "special terms"), may apply to certain pages/services
			on this site, but the applicability of any such special terms will be expressly indicated. In
			the event of any inconsistency between any special terms and this Policy, the applicable
			special terms will prevail over the terms of this Policy.
		</p>

		<h2 class="mb-2 mt-6 text-lg font-semibold">Anonymous Use</h2>
		<p class="mb-4 text-sm">
			In general, most of this site's pages are provided for informational purposes and you will be
			able to use this site without telling OPSIGO who you are or providing OPSIGO with any personal
			data about yourself. There are times, however, when in connection with your use of this site
			OPSIGO may need information about you.
		</p>

		<h2 class="mb-2 mt-6 text-lg font-semibold">Personal Data Provided by You</h2>
		<p class="mb-4 text-sm">
			To respond to your questions, fulfill your requests or manage interactive customer programs,
			it may be necessary to ask for or obtain personal data. If you provide us with any personal
			data, we may use it to respond to your requests, customize your user experience with us,
			determine your satisfaction with OPSIGO products and/or services or contact you via mail,
			e-mail, mobile message or phone, or, in accordance with local law, contact you via the
			aforementioned channels to inform you of new products, services or promotions we may offer. By
			providing information to OPSIGO through this site, you acknowledge and consent to the
			collection, use and disclosure of personally identifying information of the type and for the
			limited purposes described in this Policy. You expressly accept and give your consent that
			your personal data obtained in connection with your use of this site may be transferred, if
			permitted by applicable local legislation, across international borders to server locations
			supporting this site (including but not limited to transfers from those locations back to the
			country of your location) for operating and developing this site and OPSIGO services,
			including transfers to OPSIGO subcontractors or agents, as mentioned below, who perform tasks
			related to this site, or OPSIGO services, or for the purposes of storing the data in relevant
			databases, which may be located in Singapore or in any other country where OPSIGO has
			operations. If you place an order for a product, request a service or submit content to this
			site, we may need to contact you for additional information required to process or fulfill
			your order and/or request. Unless compelled by applicable law or administrative or judicial
			order, we will not provide this information to a third party without your permission, except
			as necessary to process your order, fulfill your requests, manage interactive customer
			programs or, if you are a corporate user, enable administration of access and usage of this
			site by authorized personnel in your organization. If allowed by applicable local legislation,
			OPSIGO may also exchange information between OPSIGO's affiliated (related) companies for the
			purposes mentioned in this Policy. Because OPSIGO is committed to protecting your privacy,
			OPSIGO does not engage in the practice of selling or trading personal data to other companies
			for promotional purposes.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Usage of Subcontractors</h3>
		<p class="mb-4 text-sm">
			We may use subcontractors to provide some products or services to you. We also may need to
			share your personal data with these subcontractors so that they can provide services to us.
			Our subcontractors are not permitted to use such personal data for any other purposes and we
			impose confidentiality requirements on their services.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Visitor Identification - Usage of "Cookies"</h3>
		<p class="mb-4 text-sm">
			From time to time, information may be placed on your computer to improve this site and
			OPSIGO's services for you. This information is commonly referred to as a "cookie", which many
			web sites use. Cookies are pieces of data stored on your computer's hard drive or browser, and
			not on this site. They typically enable collection of certain information about your computer,
			including your internet protocol address, your computer's operating system, your browser type
			and the address of any referring sites. The use of cookies provides benefits to you, such as
			eliminating the need for you to enter your password frequently during a session, or, where
			applicable, re-enter items you place in a shopping cart from visit to visit if you do not
			finish a transaction on an earlier visit. By showing how and when our visitors use this site
			or other OPSIGO sites, the use of cookies allows OPSIGO to continue to improve the sites. If
			you do not wish to receive cookies, or want to be notified of when they are placed, you may
			set your web browser to do so, if your browser so permits. Please understand that if cookies
			are turned off, you may not be able to view certain parts of this site that may enhance your
			visit. Some of our business partners whose content is linked to or from this site may also use
			cookies. However, we have no access to or control over these cookies. This site also makes use
			of cookies for website traffic analysis and anonymous demographic profiling.
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

		<h3 class="mb-2 mt-6 text-lg font-semibold">Security</h3>
		<p class="mb-4 text-sm">
			OPSIGO has endeavored to take commercially reasonable measures to prevent unauthorized access
			to and improper use of your personal data submitted to OPSIGO via your use of this site. For
			example, OPSIGO uses encryption technology when collecting financial personal data such as
			credit card information. If this site supports on-line transactions, it will use an industry
			standard security measure, such as the one available through "Secure Sockets Layer" ("SSL"),
			to protect the confidentiality and security of online transactions. If used, industry standard
			security measures like SSL authentication ensure that credit card information, as well as
			other personal data submitted as part of the buying process, is reasonably safe from third
			party interception. While there are always risks associated with providing personal data,
			whether in person, by phone or via the internet or other technologies, and no system of
			technology is completely safe or "tamper"/"hacker" proof, OPSIGO has endeavored to take
			reasonable precautions which are appropriate to the nature of the information to prevent and
			minimize such risks in connection with your use of this site.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Accuracy of Collected Data</h3>
		<p class="mb-4 text-sm">
			OPSIGO will on its own initiative, or at your request, free of charge, replenish, rectify or
			erase any incomplete, inaccurate or outdated personal data retained by OPSIGO in connection
			with the operation of this site. Please consult the contact information posted below on this
			page, if any, or elsewhere on this site to determine how best to contact OPSIGO to update
			and/or review your personal data and/or opt out of receiving marketing communications from
			OPSIGO.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Minors</h3>
		<p class="mb-4 text-sm">
			OPSIGO's policy is to request that "Minors" (the age of Minors is determined by local law
			where you reside) do not make purchases or engage in other legal acts on this site without the
			consent of a parent or legal guardian, unless permitted by applicable local law.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">External Links</h3>
		<p class="mb-4 text-sm">
			This site may contain links to other sites. Please note that OPSIGO is not responsible for the
			privacy practices or contents of any other sites. We recommend that you read the privacy
			policies of such sites.
		</p>

		<h3 class="mb-2 mt-6 text-lg font-semibold">Changes to this Policy</h3>
		<p class="mb-4 text-sm">
			OPSIGO may from time to time change this Policy or change, modify or withdraw access to this
			site at any time with or without notice. However, if this Policy is changed in a material,
			adverse way, OPSIGO will post a notice advising of such change at the beginning of this Policy
			and on this site's home page for 30 days. We recommend that you re-visit this Policy from time
			to time to learn of any such changes to this Policy.
		</p>

		<div class="mt-8 text-sm">
			© 2017 <span class="font-medium text-blue-800">OPSIGO</span> All rights reserved
		</div>
	</div>
</div>

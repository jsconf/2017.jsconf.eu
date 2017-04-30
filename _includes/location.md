{% assign map_url="https://www.google.com/maps/place/Arena+Berlin/@52.4971901,13.448364,16.92z/data=!4m8!1m2!2m1!1sdie+arena+berlin!3m4!1s0x0:0x6852fd9350063186!8m2!3d52.4969238!4d13.4539819" %}


  <p>We are super excited to announce that 2017 brings a new exciting venue for JSConf EU: <a href="http://www.arena.berlin/en/">Arena Berlin</a> ([on Google Maps](https://www.google.com/maps/place/Arena+Berlin/@52.4971901,13.448364,16.92z/data=!4m8!1m2!2m1!1sdie+arena+berlin!3m4!1s0x0:0x6852fd9350063186!8m2!3d52.4969238!4d13.4539819)). Every venue brings its own opportunities and challenges. Arena, for once, is huge. We're looking forward to bringing all that space to life with JavaScript!</p>

  <address itemprop="address" itemscope="" itemtype="http://schema.org/EventVenue">
    <strong itemprop="name"><a href="{{ map_url }}">Arena Berlin</a></strong><br>
    <span itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
      <a href="{{ map_url }}">
        <span itemprop="streetAddress">Eichenstraße 4</span>,
        <span itemprop="postalCode">12435</span> <span itemprop="addressLocality">Berlin</span>,
        <span itemprop="addressCountry">Germany</span>
      </a>
    </span>
  </address>

{% assign map_center="52.4971901,13.448364" %}
{% include map_image.md %}

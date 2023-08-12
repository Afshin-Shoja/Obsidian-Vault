
### 1) Mention what is T-SQL?

stands for Transact Structured Query Language. It is an extension of SQL functionality supported by Microsoft SQL Server.
<div dir="rtl">مخفف stands for Transact Structured Query Language یک اکستنشن از SQL</div>

---
### 2) Mention what is the difference between SQL and T-SQL?

<div dir="rtl">تفاوت بین SQL و TSQL این است که SQL یک زبان پرس و جو برای کار بر روی مجموعه ها است، در حالی که TSQL یک زبان رویه ای اختصاصی است که توسط MS SQL Server استفاده می شود. همچنین T-SQL پیاده سازی متفاوتی از DELETE و UPDATE نسبت به SQL دارد.</div>

---
### 3) Mention how tsql statements can be written and submitted to the Database engine?]
<div dir="rtl">با استفاده از SQLcmd Utility <br> با استفاده از SQL Server Management Studio<br> با اتصال از برنامه ای که ایجاد می کنید</div>

---
### 4) Mention what is “GO” in T-SQL?

<div dir="rtl">"GO" یک دستور Transact-SQL نیست بلکه یک جداکننده دسته ای است. این دستوری است که توسط ابزارهای sqlcmd و osql و ویرایشگر کد استودیو مدیریت SQL Server شناسایی شده است. ابزارهای SQL Server "GO" را به عنوان سیگنالی می خوانند که باید دسته فعلی عبارات TSQL را به نمونه ای از SQL Server ارسال کنند.</div>

---
### 5) Mention what is the difference between TRUNCATE and DELETE statement?

<div dir="rtl">تفاوت بین دستور TRUNCATE و DELETE این است که، TRUNCATE برای حذف بدون قید و شرط رکوردهای داده از جداول استفاده می شود. عملیات کوتاه کردن ثبت نشده است. DELETE برای حذف مشروط رکوردهای داده از جداول استفاده می شود. این عملیات ثبت شده است.</div>

---
### 6) Mention how does a local variable is defined using T-SQL?

<div dir="rtl"></div>
<div dir="rtl">یک متغیر محلی با استفاده از TSQL با استفاده از عبارت "DECLARE" تعریف می شود و نام متغیر محلی باید با علامت "@" به عنوان اولین کاراکتر نام آن شروع شود. به عنوان مثال، عدد صحیح CNT ما متغیر محلی را به صورت، DECLARE @CNT INT تعریف می کنیم</div>

---
### 7) Mention what does the T-SQL command IDENT_CURRENT does?

<div dir="rtl">دستور TSQL IDENT_CURRENT آخرین مقدار هویت تولید شده برای یک جدول یا نمای مشخص را برمی گرداند. آخرین مقدار هویت ایجاد شده می تواند برای هر session و هر محدوده ای باشد.</div>


---
### 8) Mention what does the T-SQL command IDENT_INCR does?

<div dir="rtl">دستور TSQL IDENT_INCR مقدار افزایشی ذکر شده در طول تشکیل یک ستون هویت در جدول یا نمای که دارای یک ستون هویت است را برمی گرداند.</div>

---
### 9) Mention if it is possible to import data directly from T-SQL commands without using SQL Server Integration Services? If yes, what are the commands?

<div dir="rtl">بله، امکان وارد کردن داده ها به طور مستقیم از دستورات T-SQL بدون استفاده از سرویس های یکپارچه سرور SQL وجود دارد. این دستورات عبارتند از:</div>
- BCP
- OpenRowSet
- Bulk Insert
- OPENQUERY
- OPENDATASOURCE
- Linked Servers

---
### 10) Mention what is sub-query?

<div dir="rtl">یک پرس و جو فرعی برای برگرداندن داده هایی استفاده می شود که در پرس و جو اصلی به عنوان شرطی برای محدود کردن بیشتر داده هایی که باید بازیابی شوند استفاده می شود. یک پرس و جو فرعی را می توان با عباراتی مانند Update،  انتخاب، حذف و درج با عملگرهایی مانند
و غیره استفاده کرد.</div>
 =، >، <، >=،<=

---
### 11) Mention what are dynamic queries in T-SQL?

<div dir="rtl">پرس و جوهای پویا در T-SQL آن دسته از پرس و جوهایی هستند که در زمان اجرا با استفاده از متغیرها یا با استفاده از CTE یا منابع دیگر طراحی می شوند. ما از تابع EXECUTE یا SP_EXECUTESQL Stored Procedure برای اجرای چنین پرس و جوهایی استفاده می کنیم.</div>

---
### 12) Mention what are ROLLUP and CUBE in T-SQL?

<div dir="rtl">جمع‌بندی و مکعب مجموعه‌های گروه‌بندی هستند که به همراه بند GROUP BY برای تولید تجمعات خلاصه‌شده استفاده می‌شوند. اینها عمدتاً برای ممیزی داده ها و تولید گزارش استفاده می شوند</div>

---
### 13) Mention what are the maximum number of rows that can be constructed by inserting rows directly in VALUE list?

<div dir="rtl">حداکثر تعداد ردیف هایی که می توان با درج ردیف ها به طور مستقیم در لیست VALUE ایجاد کرد 1000 است.</div>

---
### 14) Mention what is TOP in TSQL?

<div dir="rtl">TOP ردیف های بازگردانده شده در یک نتیجه پرس و جو را به تعداد مشخصی از ردیف یا درصد ردیف در SQL Server محدود می کند. وقتی از TOP در ترکیب با عبارت ORDERBY استفاده می‌شود، مجموعه نتایج به تعداد N اول ردیف مرتب شده محدود می‌شود. در غیر این صورت، N تعداد ردیف اول را به ترتیب نامشخصی بازیابی می کند.</div>

---
### 15) Mention what are the Join Types in TSQL?

<div dir="rtl">انواع Join در TSQL عبارتند از:</div>
- Inner join
- Outer join
- Left outer join
- Right outer join
- Left outer join with Exclusions
- Right outer join with Exclusions
- Full outer join
- Full outer joins with Exclusions
- Cross join
---
### 16) Mention what are the T String functions available in TSQL?


### 17) Mention what is the syntax used for partition in TSQL?


### 18) Mention what is the syntax for using SQL_Variant_Property?


### 19) Mention what is OFFSET-FETCH filter in tsql?


### 21) Mention what is Sp_pkeys?


### 22) Mention how to do backup entire database?


### 23) Mention what are the limitations of IDENTITY column?


### 24) Mention what is the use of SET statement in TSQL?



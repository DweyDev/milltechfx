# milltechfx


Pricing bug

The problem with the formula was in the code.
FROM
const sentimentChange = inv_based_change + ((ec - 0.5)*v)
TO
const sentimentChange = inv_based_change + ((ec - 0.5))

New type of seller
The actual class of seller should be keeped and another one should be created that inherited the parent class functionalities except calculatePriceChange(). 
